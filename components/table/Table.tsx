import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

interface TableDataProps {
  userid: string;
}

const DataTable: React.FC<TableDataProps>= ({userid}) => {


  const [data, setData] = useState<any[]>([]);
  const RENDER_URL = process.env.NEXT_PUBLIC_RENDER_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the API URL without any filters
        let apiUrl = '';
        if (!userid){
          apiUrl = `${RENDER_URL}/api/full_query?columns=datetime,Global_active_power,Global_reactive_power,Global_intensity,Voltage,consumer_id`;
        } else {
          apiUrl = `${RENDER_URL}/api/full_query?user_id=${userid}&columns=datetime,Global_active_power,Global_reactive_power,Global_intensity,Voltage,consumer_id`;
        }

        const response = await axios.get(apiUrl);
        const fetchedData = response.data;

        console.log("Fetched Data:", fetchedData); // Debugging step: Check fetched data

        // Group data by datetime and sum the consumption values
        const groupedData: Record<string, any> = {};

        fetchedData.forEach((item: any) => {
          const { datetime, Global_active_power, Global_reactive_power, Global_intensity, Voltage } = item;

          // If the datetime is already in the groupedData, add the values
          if (groupedData[datetime]) {
            groupedData[datetime].Global_active_power += Global_active_power;
            groupedData[datetime].Global_reactive_power += Global_reactive_power;
            groupedData[datetime].Global_intensity += Global_intensity;
            groupedData[datetime].Voltage += Voltage;
          } else {
            // Otherwise, initialize the values for this datetime
            groupedData[datetime] = {
              Global_active_power,
              Global_reactive_power,
              Global_intensity,
              Voltage,
            };
          }
        });

        console.log("Grouped Data:", groupedData); // Debugging step: Check the grouped and summed data

        // Convert the grouped data object into an array
        const groupedArray = Object.keys(groupedData).map((datetime) => ({
          datetime,
          ...groupedData[datetime],
        }));

        // Sort the array by datetime in descending order
        const sortedArray = groupedArray.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

        // Set the grouped and sorted data to state
        setData(sortedArray);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once when the component mounts

  return (
    <div style={{ width: '100%', margin: '0 auto', paddingTop: '20px', height: '1000px', overflowY: 'auto' }}>
      <h2>
        Metric’s Total Consumption Table
      </h2>
      <table style={{ width: '90%', borderCollapse: 'collapse', margin: '20px', alignSelf: 'center' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left' }}>Date/Time</th>
            <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left' }}>Global Active Power</th>
            <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left' }}>Global Reactive Power</th>
            <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left' }}>Global Intensity</th>
            <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left' }}>Voltage</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                  {new Date(item.datetime).toLocaleString()}
                </td>
                <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                  {item.Global_active_power.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                  {item.Global_reactive_power.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                  {item.Global_intensity.toFixed(2)}
                </td>
                <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                  {item.Voltage.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'center' }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
