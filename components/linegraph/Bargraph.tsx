import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Import the Bar chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DateTime } from 'luxon'; // Import DateTime from luxon

// Register the necessary chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarGraphProps {
  year: string;
  month: string;
  day: string;
  metric: string;
  userid: string;
}

const BarGraph: React.FC<BarGraphProps> = ({ year, month, day, metric, userid }) => {
  const [data, setData] = useState<any>(null); // Data for the chart
  const [groupedData, setGroupedData] = useState<Record<string, number>>({}); // Grouped data for the chart
  const [filter, setFilter] = useState<any>(null);

  const formatMetric = (metricValue: string) => {
    return metricValue
      .replace(/_/g, ' ')                 // Replace underscores with spaces
      .split(' ')                         // Split the string into an array of words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' ');                         // Join the words back into a string with spaces
  };

  useEffect(() => {
    // Helper function to get the month name from the month number
    const getMonthName = (monthNumber: number) => {
      const date = new Date(0); // create a new date object
      date.setMonth(monthNumber - 1); // set the month (JavaScript months are 0-indexed)
      return date.toLocaleString('default', { month: 'long' }); // Get the full month name
    };

    // Convert the month string to a number if necessary
    const monthNumber = typeof month === 'string' ? parseInt(month) : month;

    // Only update the filter when year, month, or day changes
    if (!year) {
      setFilter('Year');
    } else if (year && !month && !day) {
      setFilter(year); // If only the year is present
    } else if (year && month && !day) {
      const monthName = getMonthName(monthNumber); // Get the full month name
      setFilter(`${monthName}, ${year}`); // If year and month are present
    } else if (year && month && day) {
      const monthName = getMonthName(monthNumber); // Get the full month name
      setFilter(`${monthName} ${day}, ${year}`); // If year, month, and day are present
    }
  }, [year, month, day]); // Only run when year, month, or day changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the API URL based on the selected filters
        let apiUrl = '';
        if (!userid) {
          apiUrl = `https://wattwise-backend-12d84fc99403.herokuapp.com/api/full_query?columns=datetime,${metric}`;
        } else {
          apiUrl = `https://wattwise-backend-12d84fc99403.herokuapp.com/api/full_query?user_id=${userid}&columns=datetime,${metric}`;
        }
        const response = await axios.get(apiUrl);
        const fetchedData = response.data;

        console.log("Fetched Data:", fetchedData); // Debugging step: Check fetched data

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
            backgroundColor: 'rgba(75,192,192,0.2)', // Bar color
            borderColor: 'rgba(75,192,192,1)', // Border color
            borderWidth: 1, // Border width for the bars
          },
        ],
      });
    }
  }, [groupedData, year, month, day, metric]); // Update chart when groupedData changes

  return (
    <div style={{ width: '100%', height: '400px', margin: '0 auto'}}>
      {data ? (
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `${formatMetric(metric)} over ${filter}`,
              },
              legend: {
                display: true, // Show the legend
                position: 'top', // Position the legend at the top
                labels: {
                  font: {
                    size: 14, // Font size for the legend labels
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: `${filter}`, // X-axis label
                  font: {
                    size: 14, // Font size for the X-axis label
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: metric, // Y-axis label (based on selected metric)
                  font: {
                    size: 14, // Font size for the Y-axis label
                  },
                },
                beginAtZero: true, // Ensure the Y-axis starts at 0
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BarGraph;
