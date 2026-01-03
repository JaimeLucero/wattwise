import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartOptions } from 'chart.js'; // Import ChartOptions type
import dotenv from 'dotenv';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ForecastVisualization: React.FC = () => {


  const [metric, setMetric] = useState<string>('Global_active_power'); // Current metric selection
  const [displayedMetric, setDisplayedMetric] = useState<string>(''); // Metric for the title
  const [forecastMonths, setForecastMonths] = useState<number>(); // Actual forecast months for the fetched forecast
  const [inputForecastMonths, setInputForecastMonths] = useState<string>(''); // Input placeholder for forecast months
  const [forecast, setForecast] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isForecastFetched, setIsForecastFetched] = useState<boolean>(false);
  const RENDER_URL = process.env.NEXT_PUBLIC_RENDER_URL

  // Handle metric change
  const handleMetricChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMetric(event.target.value);
  };

  // Handle forecast months input change
  const handleForecastMonthsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputForecastMonths(event.target.value);
  };

  const formatMetric = (metric: string): string => {
    return metric
      .split('_') // Split the metric by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' '); // Join the words with spaces
  };

  const fetchForecast = async () => {
    setLoading(true);
    setError('');
    try {
      const months = Number(inputForecastMonths);
      if (isNaN(months) || months < 1) {
        setError('Please enter a valid number of months (>= 1).');
        setLoading(false);
        return;
      }

      const requestBody = {
        metric,
        forecast_months: months,
      };

      const response = await fetch(`${RENDER_URL}/api/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const data = await response.json();
      setForecast(data.forecast);
      setForecastMonths(months); // Update forecastMonths with the fetched value
      setIsForecastFetched(true);
      setDisplayedMetric(metric); // Update displayedMetric only after successful fetch
    } catch (error) {
      setError('Error fetching forecast');
      setIsForecastFetched(false);
    } finally {
      setLoading(false);
    }
  };

  // Prepare the chart data
  const chartData = {
    labels: Array.from({ length: forecast.length }, (_, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: `Forecast for ${displayedMetric}`,
        data: forecast,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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
          text: `${displayedMetric}`,
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
          value={inputForecastMonths}
          onChange={handleForecastMonthsChange}
          placeholder="Enter number of months"
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

      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{error}</p>}

      {isForecastFetched && forecast.length > 0 && !loading && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ textAlign: 'center' }}>
            Forecasted {formatMetric(displayedMetric)} Values for the Next {forecastMonths} Months
          </h3>
          <div style={{ width: '100%', height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastVisualization;
