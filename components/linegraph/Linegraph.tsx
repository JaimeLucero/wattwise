import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { DateTime } from 'luxon'; // Import DateTime from luxon

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineGraphProps {
  year: string;
  month: string;
  day: string;
  metric: string;
  userid: string;
}

const LineGraph: React.FC<LineGraphProps> = ({ year, month, day, metric, userid }) => {
  const [data, setData] = useState<any>(null); // Data for the chart
  const [groupedData, setGroupedData] = useState<Record<string, number>>({}); // Grouped data for the chart

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the API URL based on the selected filters
        let apiUrl = '';
        if (!userid){
          apiUrl = `http://127.0.0.1:5000/api/full_query?columns=datetime,${metric}`;
        } else {
          apiUrl = `http://127.0.0.1:5000/api/full_query?user_id=${userid}&columns=datetime,${metric}`;
        }
        const response = await axios.get(apiUrl);
        const fetchedData = response.data;

        console.log("Fetched Data:", fetchedData); // Debugging step: Check fetched d

        // Group data by the selected parameters
        const tempGroupedData: Record<string, number> = {};

        fetchedData.forEach((item: any) => {
          const date = DateTime.fromFormat(item.datetime, 'yyyy-MM-dd HH:mm:ss');
          
          if (!date.isValid) {
            console.error('Invalid datetime:', item.datetime);
            return;
          }
          
          // Step 1: Filter data by year (if year is selected)
          if (year && date.year !== parseInt(year)) return;

          // Step 2: Filter by month (if month is selected)
          if (month && date.month !== parseInt(month)) return;

          // Step 3: Filter by day (if day is selected)
          if (day && date.day !== parseInt(day)) return;

          // Generate the key based on the selected filters (year, month, day)
          let key = '';
          if (year && month && day) {
            // Use year, month, day, and hour for hourly data
            key = date.toFormat('yyyy-MM-dd HH');
          } else if (year && month) {
            // Use year, month, and day for daily data
            key = date.toFormat('yyyy-MM-dd');
          } else if (year) {
            // Use only year for yearly data
            key = date.toFormat('yyyy-MM');
          } else {
            // Default: group by year
            key = date.toFormat('yyyy'); // Group by year
          }

          // Ensure metric is valid
          if (isNaN(item[metric])) {
            console.error(`Invalid ${metric} value:`, item[metric]);
            return;
          }

          if (key) {
            // If key already exists, sum the values
            if (tempGroupedData[key]) {
              tempGroupedData[key] += item[metric]; // Sum the metric for the group
            } else {
              tempGroupedData[key] = item[metric]; // Initialize for the group
            }
          }
        });

        console.log("Grouped Data:", tempGroupedData); // Debugging: Check the grouped data

        // Update the state with the grouped data
        setGroupedData(tempGroupedData);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [year, month, day, metric, userid]); // Trigger effect when params change

  // Prepare chart data
  useEffect(() => {
    const labels = Object.keys(groupedData);
    const values = Object.values(groupedData);

    // Update chart data
    if (labels.length && values.length) {
      setData({
        labels: labels, // X-axis labels
        datasets: [
          {
            label: `Total ${metric} (per ${year ? 'Year' : month ? 'Month' : 'Day'})`, // Dynamic label based on year/month/day
            data: values, // Y-axis data (summed metric values)
            borderColor: 'rgba(75,192,192,1)', // Line color
            backgroundColor: 'rgba(75,192,192,0.2)', // Background color
            fill: true, // Whether to fill the area under the line
          },
        ],
      });
    }
  }, [groupedData, year, month, day, metric]); // Update chart when groupedData changes

  return (
    <div style={{ width: '90%', height: '400px', margin: '0 auto' }}>
      {data ? (
        <Line data={data} options={{ responsive: true, plugins: { title: { display: true, text: `${metric} over Time` } } }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LineGraph;
