import React, { useState, useEffect } from 'react';

// Define the structure of your usage data
interface UsageData {
  Global_active_power: number;
  Global_intensity: number;
  Global_reactive_power: number;
  Voltage: number;
  consumer_id: number;
  datetime: string;
}

interface BillingInformationProps {
  userid: string;
}

const BillingInformation: React.FC<BillingInformationProps> = ({userid}) => {
  const [data, setData] = useState<UsageData[]>([]);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/full_query?user_id=${userid}`); // Replace with your API URL
        const result = await response.json();
        console.log('Fetched Data:', result);  // Add a log to check what the data looks like
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userid]);

  // Function to group data by month
  const groupDataByMonth = (data: UsageData[]) => {
    return data.reduce((acc: any, item) => {
      const date = new Date(item.datetime);
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format as YYYY-MM
      if (!acc[yearMonth]) {
        acc[yearMonth] = [];
      }
      acc[yearMonth].push(item);
      return acc;
    }, {});
  };

  // Calculate the billing info for the most recent month
const calculateBillingInfo = (data: UsageData[], month: string) => {
    if (!data.length) return null;
  
    // Helper function to calculate total consumption for a given date range
    const calculateMonthlyConsumption = (data: UsageData[], startDate: Date, endDate: Date) => {
      return data.reduce((acc, item) => {
        const itemDate = new Date(item.datetime);
  
        // Check if the item is within the given range (startDate to endDate)
        if (itemDate >= startDate && itemDate <= endDate) {
          const activePower = item.Global_active_power || 0;
          const reactivePower = item.Global_reactive_power || 0;
          const intensity = item.Global_intensity || 0;
          const voltage = item.Voltage || 0;
  
          // Calculate daily consumption (in watts) and convert it to kWh
          const consumption = (activePower * 1) + (reactivePower * 0.8) + (intensity * 0.5) + (voltage / 1000);
          return acc + consumption;
        }
        return acc;
      }, 0);
    };
  
    // Get the start date and end date for the current month
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);  // Move to the next month
    endDate.setDate(0);  // Set to the last day of the month
  
     // Get the date for one month before the start date
    const oneMonthBeforeStart = new Date(startDate);
    oneMonthBeforeStart.setMonth(oneMonthBeforeStart.getMonth() - 1);  // Subtract one month from the start date

    // Calculate consumption for the one month before the start of the month (startConsumption)
    const startConsumption = calculateMonthlyConsumption(data, oneMonthBeforeStart, startDate);

    // Calculate consumption for the end of the month (end consumption)
    const endConsumption = calculateMonthlyConsumption(data, startDate, endDate);
  
    // Calculate the total consumption as the difference between the end and start consumptions
    const totalConsumption = endConsumption - startConsumption;
  
    if (totalConsumption === 0) {
      return null;  // Avoid division by zero if no consumption data
    }
  
    const averageConsumption = totalConsumption / data.length;
  
    // Assuming a rate for the billing, for example $0.17 per kWh
    const rate = 0.17; // Example rate in dollars per kWh
    const billingAmount = (totalConsumption / 1000) * rate; // Convert to kWh and calculate cost
  
    return {
      totalConsumption: (totalConsumption / 1000).toFixed(2),  // Convert to kWh
      averageConsumption: (averageConsumption / 1000).toFixed(2),  // Convert to kWh
      billingAmount: billingAmount.toFixed(2),
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      startConsumption: (startConsumption / 1000).toFixed(2), // Convert to kWh
      endConsumption: (endConsumption / 1000).toFixed(2), // Convert to kWh
    };
  };
  
  // Process the data to get the most recent month
  useEffect(() => {
    if (data.length > 0) {
      const groupedData = groupDataByMonth(data);
      const mostRecentMonth = Object.keys(groupedData).sort().pop(); // Get the most recent month
      console.log('Most Recent Month:', mostRecentMonth);  // Add a log to check the selected month
      if (mostRecentMonth) {
        const recentMonthData = groupedData[mostRecentMonth];
        const billingInfo = calculateBillingInfo(recentMonthData, mostRecentMonth);
        console.log('Calculated Billing Info:', billingInfo);  // Log the calculated billing info
        setBillingInfo(billingInfo);
      }
    }
  }, [data]);

  if (loading) {
    return <div>Loading billing information...</div>;
  }

  if (!billingInfo) {
    return <div>No billing information available.</div>;
  }

  return (
    <div style={{ width: '90%', margin: '20px', padding: '20px', gap: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
        <h2>Billing Summary</h2>

        {/* Wrapper for each value with fixed width for consistent borders */}
        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <strong style={{ textAlign: 'left', width: '230px' }}>Billing Period:</strong>
            <div style={{ border: '1px solid black', borderRadius: '8px', padding: '5px', width: '230px', textAlign: 'center', whiteSpace: 'nowrap' }}>
            {billingInfo.startDate} - {billingInfo.endDate}
            </div>
        </div>

        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <strong style={{ textAlign: 'left', width: '230px' }}>Total Consumption:</strong>
            <div style={{ border: '1px solid black', borderRadius: '8px', padding: '5px', width: '230px', textAlign: 'center', whiteSpace: 'nowrap' }}>
            {billingInfo.totalConsumption} kWh
            </div>
        </div>

        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <strong style={{ textAlign: 'left', width: '230px' }}>Average Consumption:</strong>
            <div style={{ border: '1px solid black', borderRadius: '8px', padding: '5px', width: '230px', textAlign: 'center', whiteSpace: 'nowrap' }}>
            {billingInfo.averageConsumption} kWh
            </div>
        </div>

        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <strong style={{ textAlign: 'left', width: '230px' }}>Billing Amount:</strong>
            <div style={{ border: '1px solid black', borderRadius: '8px', padding: '5px', width: '230px', textAlign: 'center', whiteSpace: 'nowrap' }}>
            ${billingInfo.billingAmount}
            </div>
        </div>

        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <strong style={{ textAlign: 'left', width: '230px' }}>Start Date Consumption:</strong>
            <div style={{ border: '1px solid black', borderRadius: '8px', padding: '5px', width: '230px', textAlign: 'center', whiteSpace: 'nowrap' }}>
            {billingInfo.startConsumption} kWh
            </div>
        </div>

        <div style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <strong style={{ textAlign: 'left', width: '230px' }}>End Date Consumption:</strong>
            <div style={{ border: '1px solid black', borderRadius: '8px', padding: '5px', width: '230px', textAlign: 'center', whiteSpace: 'nowrap' }}>
            {billingInfo.endConsumption} kWh
            </div>
        </div>
    </div>
  );
};

export default BillingInformation;
