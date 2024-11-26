import React, { useState, useEffect } from "react";

interface PowerData {
  Global_active_power: number;
  Reactive_power: number;
  Voltage: number;
  Intensity: number;
  datetime: string;
}

const PowerCostCalculator: React.FC = () => {
  const [cost, setCost] = useState<number | null>(null);
  const [previousCost, setPreviousCost] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [metricsChanges, setMetricsChanges] = useState<any>(null); // Store the individual metric changes
  const costPerKWh = 0.12; // Example cost per kWh

  // Fetch power data from the API
  const fetchPowerData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/full_query");
      const data = await response.json();

      if (response.ok) {
        calculateCost(data);
        getCurrentYearFromData(data);
        calculateMetricsChanges(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Get the most recent year from the data
  const getCurrentYearFromData = (data: PowerData[]) => {
    if (data.length > 0) {
      const mostRecentDatetime = data.reduce((latest, current) => {
        return new Date(current.datetime) > new Date(latest.datetime) ? current : latest;
      });

      const year = new Date(mostRecentDatetime.datetime).getFullYear();
      setCurrentYear(year);
    }
  };

  // Group the data by year
  const groupDataByYear = (data: PowerData[]) => {
    return data.reduce((groups: { [key: string]: PowerData[] }, item) => {
      const year = new Date(item.datetime).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(item);
      return groups;
    }, {});
  };

  // Calculate energy consumption for each year
  const calculateEnergyConsumption = (data: PowerData[]) => {
    return data.reduce((total, item) => {
      const energyConsumption = item.Global_active_power / 1000; // Convert to kWh
      return total + energyConsumption;
    }, 0);
  };

  // Calculate annual cost for a year
  const calculateAnnualCost = (data: PowerData[]) => {
    const totalEnergyConsumption = calculateEnergyConsumption(data);
    const annualEnergyConsumption = totalEnergyConsumption * 8760; // Multiply by hours in a year (365 * 24)
    return annualEnergyConsumption * costPerKWh; // Multiply by cost per kWh
  };

  // Calculate cost per year and set cost values
  const calculateCost = (data: PowerData[]) => {
    const groupedData = groupDataByYear(data);

    // Calculate the cost for each year
    const yearCosts = Object.keys(groupedData).map((year) => {
      const annualCost = calculateAnnualCost(groupedData[year]);
      return { year, cost: annualCost };
    });

    if (yearCosts.length > 0) {
      const latestYear = yearCosts[yearCosts.length - 1];
      setCost(latestYear.cost);

      // Example previous year's cost (you would replace this with real data from your API or database)
      const prevYearCost = yearCosts.length > 1 ? yearCosts[yearCosts.length - 2].cost : 1200; // Previous year cost
      setPreviousCost(prevYearCost);
    }
  };

  const calculateMetricsChanges = (data: PowerData[]) => {
    const groupedData = groupDataByYear(data);
  
    // Calculate the change for each metric in the most recent year vs the previous year
    const yearKeys = Object.keys(groupedData);
    const mostRecentYear = yearKeys[yearKeys.length - 1];
    const previousYear = yearKeys[yearKeys.length - 2];
  
    if (mostRecentYear && previousYear) {
      const recentYearData = groupedData[mostRecentYear];
      const previousYearData = groupedData[previousYear];
  
      const averageMetrics = {
        activePower: calculateAverage(recentYearData, "Global_active_power"),
        reactivePower: calculateAverage(recentYearData, "Reactive_power"),
        voltage: calculateAverage(recentYearData, "Voltage"),
        intensity: calculateAverage(recentYearData, "Intensity"),
      };
  
      const previousMetrics = {
        activePower: calculateAverage(previousYearData, "Global_active_power"),
        reactivePower: calculateAverage(previousYearData, "Reactive_power"),
        voltage: calculateAverage(previousYearData, "Voltage"),
        intensity: calculateAverage(previousYearData, "Intensity"),
      };
  
      const changes = {
        activePowerChange: calculatePercentageChange(averageMetrics.activePower, previousMetrics.activePower),
        reactivePowerChange: calculatePercentageChange(averageMetrics.reactivePower, previousMetrics.reactivePower),
        voltageChange: calculatePercentageChange(averageMetrics.voltage, previousMetrics.voltage),
        intensityChange: calculatePercentageChange(averageMetrics.intensity, previousMetrics.intensity),
      };
  
      setMetricsChanges(changes);
    }
  };
  

  // Calculate average for a given metric across a year's data
  const calculateAverage = (data: PowerData[], metric: string) => {
    if (data.length === 0) {
      console.log(`No data for metric: ${metric}`);
      return 0;
    }
  
    const total = data.reduce((sum, item) => {
      if (item[metric] === undefined || item[metric] === null || isNaN(item[metric])) {
        console.log(`Invalid data for metric: ${metric}`, item);
      }
      return sum + item[metric];
    }, 0);
  
    return total / data.length;
  };
  

  // Calculate the percentage change between two values
  // Calculate the percentage change between two values
    const calculatePercentageChange = (newValue: number, oldValue: number) => {
        if (oldValue === 0) {
        // Handle the case where the old value is zero
        if (newValue === 0) {
            return 0; // No change if both values are zero
        } else {
            return newValue > 0 ? 100 : -100; // 100% change if the old value is zero
        }
        }
        return ((newValue - oldValue) / oldValue) * 100;
    };
  

  // Generate a message for cost change
  const getCostChangeMessage = () => {
    if (previousCost === null || cost === null) return null;
  
    const percentageChange = ((cost - previousCost) / previousCost) * 100;
  
    const message = () => {
      if (percentageChange > 0) {
        return (
          <p style={{ color: "red" }}>
            The cost has increased by {percentageChange.toFixed(2)}% compared to last year.
          </p>
        );
      } else if (percentageChange < 0) {
        return (
          <p style={{ color: "green" }}>
            The cost has decreased by {Math.abs(percentageChange).toFixed(2)}% compared to last year.
          </p>
        );
      } else {
        return <p>The cost is the same as last year.</p>;
      }
    };
  
    return (
      <div style={{ width: "80%", margin: "0 auto", paddingTop: '20px' }}>
        {message()}
      </div>
    );
  };

  // Generate the metric change messages
// Generate the metric change messages
const getMetricChangeMessage = () => {
    if (!metricsChanges) return null;
  
    const messages = {
      activePower: isNaN(metricsChanges.activePowerChange) ?
        <span><strong>Active Power:</strong> No calculated change from previous year.</span> :
        (metricsChanges.activePowerChange === 0 ?
          <span><strong>Active Power:</strong> No significant change from previous year.</span> :
          (metricsChanges.activePowerChange > 0 ?
            <span><strong>Active Power:</strong> Increased by {metricsChanges.activePowerChange.toFixed(2)}% from previous year. Possible Cause: Extended use of high-power appliances.</span> :
            <span><strong>Active Power:</strong> Decreased by {Math.abs(metricsChanges.activePowerChange).toFixed(2)}% from previous year.</span>)),
  
      reactivePower: isNaN(metricsChanges.reactivePowerChange) ?
        <span><strong>Reactive Power:</strong> No calculated change from previous year.</span> :
        (metricsChanges.reactivePowerChange === 0 ?
          <span><strong>Reactive Power:</strong> No significant change from previous year.</span> :
          (metricsChanges.reactivePowerChange > 0 ? 
            <span><strong>Reactive Power:</strong> Increased by {metricsChanges.reactivePowerChange.toFixed(2)}% from previous year. Possible Cause: High load or grid fluctuations.</span> : 
            <span><strong>Reactive Power:</strong> Decreased by {Math.abs(metricsChanges.reactivePowerChange).toFixed(2)}% from previous year.</span>)),
  
      voltage: isNaN(metricsChanges.voltageChange) ?
        <span><strong>Voltage:</strong> No calculated change from previous year.</span> :
        (metricsChanges.voltageChange === 0 ? 
          <span><strong>Voltage:</strong> No significant change from previous year.</span> :
          (metricsChanges.voltageChange > 0 ? 
            <span><strong>Voltage:</strong> Increased by {metricsChanges.voltageChange.toFixed(2)}% from previous year. Possible Cause: High load or grid fluctuations.</span> : 
            <span><strong>Voltage:</strong> Decreased by {Math.abs(metricsChanges.voltageChange).toFixed(2)}% from previous year.</span>)),
  
      intensity: isNaN(metricsChanges.intensityChange) ?
        <span><strong>Intensity:</strong> No calculated change from previous year.</span> :
        (metricsChanges.intensityChange === 0 ? 
          <span><strong>Intensity:</strong> No significant change from previous year.</span> :
          (metricsChanges.intensityChange > 0 ? 
            <span><strong>Intensity:</strong> Increased by {metricsChanges.intensityChange.toFixed(2)}% from previous year. Possible Cause: High load or grid fluctuations.</span> : 
            <span><strong>Intensity:</strong> Decreased by {Math.abs(metricsChanges.intensityChange).toFixed(2)}% from previous year.</span>))
    };
  
    return (
      <div style={{ width: '80%', paddingTop: '20px' }}>
        <p style={{ fontSize: '0.8rem', textAlign: 'left' }}>{messages.activePower}</p>
        <p style={{ fontSize: '0.8rem', textAlign: 'left' }}>{messages.reactivePower}</p>
        <p style={{ fontSize: '0.8rem', textAlign: 'left' }}>{messages.voltage}</p>
        <p style={{ fontSize: '0.8rem', textAlign: 'left' }}>{messages.intensity}</p>
      </div>
    );
  };
  
  

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchPowerData();
  }, []);

  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
      <h1>Consumption cost</h1>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && currentYear && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center" }}>
          <p>
            Current Annual Cost for {currentYear}:
          </p>
          <p style={{ fontSize: '3rem' }}>
            <strong>${cost?.toFixed(2)}</strong>
          </p>
          {previousCost !== null && (
            <p>
              <strong>Previous Year Cost:</strong> ${previousCost.toFixed(2)}
            </p>
          )}
          {getCostChangeMessage()}
          <div
          style={{
            paddingLeft: '40px',
            alignSelf: 'center',
            width: '100%'
          }}
          >
            {getMetricChangeMessage()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerCostCalculator;
