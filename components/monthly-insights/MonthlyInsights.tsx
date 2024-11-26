import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ConsumerInsightsProps {
  userId: string; // User ID for the consumer
}

// Define the types for the usage data and periods
interface UsageData {
  datetime: string;
  Global_active_power: number;
  Voltage: number;
  [key: string]: any; // Allow additional properties
}

interface Period {
  startDate: string;
  endDate: string;
}

const ConsumerInsights: React.FC<ConsumerInsightsProps> = ({ userId }) => {
  const [usageData, setUsageData] = useState<UsageData[]>([]); // Define usage data as an array of UsageData
  const [recentMonthPeriod, setRecentMonthPeriod] = useState<Period>({ startDate: '', endDate: '' });
  const [peak7DayPeriod, setPeak7DayPeriod] = useState<Period>({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [breakdownInsights, setBreakdownInsights] = useState<any>(null); // To store breakdown insights

  // Fetch consumer's energy usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/full_query?user_id=${userId}`);
        console.log('Fetched Data:', response.data); // Log the fetched data
        if (response.data && Array.isArray(response.data)) {
          setUsageData(response.data);
        } else {
          setError('Invalid data structure received');
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching usage data');
        setLoading(false);
      }
    };

    fetchUsageData();
  }, [userId]);

  // Function to get the most recent month's period
  const getRecentMonthPeriod = (data: UsageData[]): Period => {
    if (data.length === 0) {
      console.log("No data available");
      return { startDate: '', endDate: '' };
    }
  
    // Find the most recent date based on the timestamp field
    const mostRecentDate = data.reduce((latest, current) => {
      const latestDate = new Date(latest.datetime);
      const currentDate = new Date(current.datetime);
      return currentDate > latestDate ? current : latest;
    });
  
    console.log('Most Recent Date:', mostRecentDate.datetime);
  
    // Get the month and year for the most recent date
    const recentMonth = new Date(mostRecentDate.datetime).getMonth();
    const recentYear = new Date(mostRecentDate.datetime).getFullYear();
    console.log('Filtering for Most Recent Month:', recentMonth + 1, 'Year:', recentYear);
  
    // Calculate the first and last day of the most recent month
    const startDate = new Date(recentYear, recentMonth, 1);
    const endDate = new Date(recentYear, recentMonth + 1, 0); // The last day of the month
  
    console.log('Start Date of Recent Month:', startDate);
    console.log('End Date of Recent Month:', endDate);
  
    return {
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
    };
  };
  
  // Function to get the peak 7-day period based on total consumption for the most recent month
  const getPeak7DayPeriod = (data: UsageData[], startDate: string, endDate: string): Period => {
    if (data.length === 0) {
      console.log("No data available");
      return { startDate: '', endDate: '' };
    }

    // Filter the data to include only the most recent month
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.datetime);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    console.log('Filtered Data for the Most Recent Month:', filteredData);

    if (filteredData.length === 0) {
      console.log("No data found for the recent month");
      return { startDate: '', endDate: '' };
    }

    // Group the data by day and sum the consumption for each day
    const dailyConsumption = filteredData.reduce((acc, item) => {
      const itemDate = new Date(item.datetime).toLocaleDateString();
      if (!acc[itemDate]) {
        acc[itemDate] = {
          totalPower: 0,
          totalVoltage: 0,
          count: 0,
        };
      }
      acc[itemDate].totalPower += item.Global_active_power; // Using Global_active_power as total consumption
      acc[itemDate].totalVoltage += item.Voltage; // Sum the voltage values
      acc[itemDate].count += 1; // Count the entries per day
      return acc;
    }, {} as Record<string, { totalPower: number, totalVoltage: number, count: number }>);

    // Convert dailyConsumption object to an array and sort by total consumption
    const sortedDays = Object.entries(dailyConsumption).sort((a, b) => b[1].totalPower - a[1].totalPower);

    console.log('Sorted Daily Consumption:', sortedDays);

    if (sortedDays.length === 0) {
      return { startDate: '', endDate: '' };
    }

    // Find the day with the highest consumption
    const peakDay = sortedDays[0][0];
    console.log('Peak Day:', peakDay);

    // Get the 3 days before and 3 days after the peak day
    const peakDate = new Date(peakDay);
    const start7Day = new Date(peakDate);
    const end7Day = new Date(peakDate);

    start7Day.setDate(peakDate.getDate() - 3); // 3 days before
    end7Day.setDate(peakDate.getDate() + 3); // 3 days after

    console.log('Peak 7-Day Start Date:', start7Day);
    console.log('Peak 7-Day End Date:', end7Day);

    // Return the 7-day period as a string
    return {
      startDate: start7Day.toLocaleDateString(),
      endDate: end7Day.toLocaleDateString(),
    };
  };

  // Use effect to process the usage data when it is updated
  useEffect(() => {
    if (usageData.length > 0) {
      const recentMonth = getRecentMonthPeriod(usageData);
      setRecentMonthPeriod(recentMonth); // Update state with the recent month period

      const peak7Day = getPeak7DayPeriod(usageData, recentMonth.startDate, recentMonth.endDate);
      setPeak7DayPeriod(peak7Day); // Update state with the peak 7-day period

      if (peak7Day.startDate && peak7Day.endDate) {
        const insights = getBreakdownInsights(usageData, peak7Day.startDate, peak7Day.endDate);
        setBreakdownInsights(insights); // Set breakdown insights
      }
    }
  }, [usageData]); // This effect runs whenever `usageData` is updated

  const getBreakdownInsights = (data: UsageData[], startDate: string, endDate: string) => {
    // Filter data based on the selected date range
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.datetime);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  
    // Helper function to calculate average, peak, and change from average
    const calculateMetricInsights = (values: number[]) => {
      if (values.length === 0) {
        return {
          value: "No data",
          changeFromAvg: "No change",
          recommendation: "No data available for recommendations."
        };
      }
  
      const average = values.reduce((acc, value) => acc + value, 0) / values.length;
      const peak = Math.max(...values);
      const changeFromAvg = ((peak - average) / average) * 100;
  
      // Check for NaN values
      if (isNaN(average) || isNaN(peak) || isNaN(changeFromAvg)) {
        return {
          value: "",
          changeFromAvg: "",
          recommendation: "Error calculating data. Please check your input."
        };
      }
  
      // Determine recommendation based on metric
      let recommendation = "";
      if (peak > average * 1.5) {
        recommendation = "Consider reducing usage during peak periods to avoid higher consumption costs.";
      } else if (peak < average * 0.5) {
        recommendation = "Usage is quite low. Ensure appliances are running optimally.";
      } else {
        recommendation = "Monitor your consumption during peak periods for more control over energy usage.";
      }
  
      return {
        value: peak.toFixed(2), // Peak value rounded to 2 decimals
        changeFromAvg: changeFromAvg.toFixed(2), // Percent change rounded to 2 decimals
        recommendation: recommendation
      };
    };
  
    // Metrics to calculate breakdown for
    const metrics = {
      Global_active_power: "activePower",
      Reactive_power: "reactivePower",
      Voltage: "voltage",
      Intensity: "intensity"
    };
  
    // Object to hold insights for all metrics
    const breakdown: any = {};
  
    // Loop through each metric and compute insights
    Object.entries(metrics).forEach(([key, name]) => {
      const values = filteredData.map(item => item[key]);
      breakdown[name] = calculateMetricInsights(values);
    });
  
    return breakdown;
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ width: '90%', margin: '20px', padding: '20px', gap: '15px', display:'flex', flexDirection:'column' }}>
      <h2>Monthly Insights</h2>
      {peak7DayPeriod.startDate && peak7DayPeriod.endDate && (
        <div>
          <h3>Peak 7-Day Period:</h3>
          <p>Start Date: {peak7DayPeriod.startDate}   <strong>-</strong>   End Date: {peak7DayPeriod.endDate}</p>
        </div>
      )}

        {
        breakdownInsights ? (
            <div
            style={{
                paddingTop: '10px'
            }}
            >
            <h3>Breakdown Insights:</h3>
            {Object.entries(breakdownInsights).map(([key, metric]) => (
                <div key={key}>
                <h4>
                {key
                    .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
                    .trim() // Remove extra spaces
                    .toLowerCase() // Convert all letters to lowercase
                    .replace(/\b\w/g, char => char.toUpperCase())} {/* Capitalize first letter of each word */}
                </h4>
                <p>Value: {metric.value ? `${metric.value} W` : 'No data available'}</p>
                <p>Change from Average: {metric.changeFromAvg ? `${metric.changeFromAvg} %` : 'No data available'}</p>
                <p style={{fontSize:'0.7rem'}}>Recommendation: {metric.recommendation}</p>
                </div>
            ))}
            </div>
        ) : (
            <div>Loading Breakdown Insights...</div>
        )
        }
    </div>
  );
};

export default ConsumerInsights;
