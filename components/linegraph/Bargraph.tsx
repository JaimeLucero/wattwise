import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { DateTime } from 'luxon';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarGraphProps {
  year: string;
  month: string;
  day: string;
  metric: string;
  userid: string;
}

const BarGraph: React.FC<BarGraphProps> = ({ year, month, day, metric, userid }) => {
  const [data, setData] = useState<any>(null);
  const [groupedData, setGroupedData] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<any>(null);

  const formatMetric = (metricValue: string) => {
    return metricValue
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const getMonthName = (monthNumber: number) => {
      const date = new Date(0);
      date.setMonth(monthNumber - 1);
      return date.toLocaleString('default', { month: 'long' });
    };

    const monthNumber = typeof month === 'string' ? parseInt(month) : month;

    if (!year) {
      setFilter('Year');
    } else if (year && !month && !day) {
      setFilter(year);
    } else if (year && month && !day) {
      const monthName = getMonthName(monthNumber);
      setFilter(`${monthName}, ${year}`);
    } else if (year && month && day) {
      const monthName = getMonthName(monthNumber);
      setFilter(`${monthName} ${day}, ${year}`);
    }
  }, [year, month, day]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = userid
          ? `https://wattwise-backend-12d84fc99403.herokuapp.com/api/full_query?user_id=${userid}&columns=datetime,${metric}`
          : `https://wattwise-backend-12d84fc99403.herokuapp.com/api/full_query?columns=datetime,${metric}`;

        const response = await axios.get(apiUrl);
        const fetchedData = response.data;

        const tempGroupedData: Record<string, number> = {};

        fetchedData.forEach((item: any) => {
          const date = DateTime.fromFormat(item.datetime, 'yyyy-MM-dd HH:mm:ss');

          if (!date.isValid) return;

          if (year && date.year !== parseInt(year)) return;
          if (month && date.month !== parseInt(month)) return;
          if (day && date.day !== parseInt(day)) return;

          let key = '';
          if (year && month && day) {
            key = date.toFormat('yyyy-MM-dd HH');
          } else if (year && month) {
            key = date.toFormat('yyyy-MM-dd');
          } else if (year) {
            key = date.toFormat('yyyy-MM');
          } else {
            key = date.toFormat('yyyy');
          }

          if (!isNaN(item[metric])) {
            tempGroupedData[key] = (tempGroupedData[key] || 0) + item[metric];
          }
        });

        setGroupedData(tempGroupedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [year, month, day, metric, userid]);

  useEffect(() => {
    const labels = Object.keys(groupedData);
    const values = Object.values(groupedData);

    if (labels.length && values.length) {
      setData({
        labels,
        datasets: [
          {
            label: `Total ${metric} (per ${year ? 'Year' : month ? 'Month' : 'Day'})`,
            data: values,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [groupedData, year, month, day, metric]);

  return (
    <div
      style={{
        width: '90%', // Responsive width
        maxWidth: '1000px', // Optional: limit maximum width
        height: 'auto', // Let height adjust dynamically
        margin: '20px auto', // Center the chart container
        padding: '10px',
        boxSizing: 'border-box', // Ensure padding doesn't affect width
      }}
    >
      {data ? (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Allow the chart to fill its container
              plugins: {
                title: {
                  display: true,
                  text: `${formatMetric(metric)} over ${filter}`,
                },
                legend: {
                  position: 'top',
                  labels: {
                    font: { size: 14 },
                  },
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: filter,
                    font: { size: 14 },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: metric,
                    font: { size: 14 },
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BarGraph;
