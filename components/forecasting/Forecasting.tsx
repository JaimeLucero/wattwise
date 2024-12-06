import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartOptions } from 'chart.js'; // Import ChartOptions type

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ForecastData {
  forecast: number[];
}

const ForecastVisualization: React.FC = () => {
  const [metric, setMetric] = useState<string>('Global_active_power'); // Default metric
  const [forecastMonths, setForecastMonths] = useState<number>(6); // Default forecast months
  const [forecast, setForecast] = useState<number[]>([]); // Forecast data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isForecastFetched, setIsForecastFetched] = useState<boolean>(false); // Track if forecast data is fetched

  // Handle metric change
  const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMetric(event.target.value);
  };

  // Handle forecast months change
  const handleForecastMonthsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForecastMonths(Number(event.target.value));
  };

  const fetchForecast = async () => {
    setLoading(true);
    setError('');
    try {
      // The request body should match the required structure
      const requestBody = {
        metric: metric,  // This will be something like 'Global_active_power'
        forecast_months: forecastMonths,  // This will be a number like 12
      };
  
      console.log('Request Body:', requestBody);  // For debugging
  
      const response = await fetch('https://wattwise-backend-12d84fc99403.herokuapp.com/api/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),  // Ensure this is the correct JSON format
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }
  
      const data = await response.json();
      setForecast(data.forecast);  // Assuming response structure is correct
      setIsForecastFetched(true); // Set the flag to indicate that the forecast is fetched
  
    } catch (error) {
      setError('Error fetching forecast');
      setIsForecastFetched(false); // Ensure the flag is reset if there is an error
    } finally {
      setLoading(false);
    }
  };

  // Prepare the chart data
  const chartData = {
    labels: Array.from({ length: forecast.length }, (_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: `Forecast for ${metric}`,
        data: forecast,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Chart options including legend and axis labels
  const chartOptions:  ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,  // Ensure chart stretches to fill container
    plugins: {
      legend: {
        position:'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: `${metric}`,
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', width: '100%', margin: 'auto' }} className="forecast-container">
      <h2 style={{ textAlign: 'center' }}>Forecast Visualization</h2>

      {/* Metric and Forecast Selection */}
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="metric" style={{ fontSize: '16px', fontWeight: 'bold' }}>Select Metric:</label>
        <select
          id="metric"
          value={metric}
          onChange={handleMetricChange}
          style={{
            padding: '8px',
            fontSize: '14px',
            width: '100%',
            maxWidth: '300px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ddd',
          }}
        >
          <option value="Global_active_power">Global Active Power</option>
          <option value="Global_reactive_power">Global Reactive Power</option>
          <option value="Voltage">Voltage</option>
          <option value="Global_intensity">Global Intensity</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="forecast_months" style={{ fontSize: '16px', fontWeight: 'bold' }}>Select Forecast Months:</label>
        <input
          id="forecast_months"
          type="number"
          value={forecastMonths}
          onChange={handleForecastMonthsChange}
          min={1}
          style={{
            padding: '8px',
            fontSize: '14px',
            width: '100%',
            maxWidth: '100px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ddd',
          }}
        />
      </div>

      <button
        onClick={fetchForecast}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '200px',
          marginTop: '20px',
        }}
      >
        {loading ? 'Loading...' : 'Get Forecast'}
      </button>

      {/* Error Message */}
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

      {/* Chart */}
      {isForecastFetched && forecast.length > 0 && !loading && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ textAlign: 'center' }}>Forecasted {metric} Values</h3>
          <div style={{ width: '100%', height: '400px' }}> {/* Bigger chart container */}
            <Line data={chartData} options={chartOptions} /> {/* Disable aspect ratio to take full container space */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastVisualization;
