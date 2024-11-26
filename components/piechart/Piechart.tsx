import React, { useEffect, useRef, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const PieChart: React.FC = () => {
  const chartDiv = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/full_query');
        const data = await response.json();
        setChartData(data);

        const uniqueYears: number[] = Array.from(
          new Set(data.map((item: any) => new Date(item.datetime).getFullYear()))
        );
        setYears(uniqueYears);
        setSelectedYear(uniqueYears[0] || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter and sum data based on selected year
  const filteredData = chartData.filter(
    (item: any) => new Date(item.datetime).getFullYear() === selectedYear
  );

  // Sum the metrics for the selected year
  const summedData = filteredData.reduce(
    (acc: any, item: any) => {
      acc.Global_active_power += item.Global_active_power;
      acc.Global_intensity += item.Global_intensity;
      acc.Global_reactive_power += item.Global_reactive_power;
      acc.Voltage += item.Voltage;
      return acc;
    },
    {
      Global_active_power: 0,
      Global_intensity: 0,
      Global_reactive_power: 0,
      Voltage: 0,
    }
  );

  // Prepare data for the pie chart
  const pieChartData = [
    { category: 'Global Active Power', value: summedData.Global_active_power, color: '#FFAE4C' },
    { category: 'Global Intensity', value: summedData.Global_intensity, color: '#1D95B2' },
    { category: 'Global Reactive Power', value: summedData.Global_reactive_power, color: '#8979FF' },
    { category: 'Voltage', value: summedData.Voltage, color: '#FF928A' }
  ];

  // Create pie chart
  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    if (summedData.Global_active_power !== undefined) {
      let chart = am4core.create(chartDiv.current!, am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0;

      chart.data = pieChartData;
      chart.innerRadius = 45;

      let series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = 'value';
      series.dataFields.category = 'category';
      series.labels.template.disabled = true;
      series.ticks.template.disabled = true;

      chart.legend = new am4charts.Legend();
      chart.legend.position = 'bottom';
      chart.legend.paddingTop = 20;  // Top padding
      chart.legend.paddingBottom = 10;  // Bottom padding
      chart.legend.paddingLeft = 5;  // Left padding
      chart.legend.paddingRight = 5;  // Right padding
      chart.legend.fontSize = 8;
      chart.legend.maxWidth = chartDiv.current!.offsetWidth; // Set max width for the legend container

      chart.legend.align = 'center';

      series.colors.list = pieChartData.map((item: any) => am4core.color(item.color));
      chart.legend.useDefaultMarker = false;

      chart.legend.markers.template.width = 10;  // Set width of color indicator
      chart.legend.markers.template.height = 10; // Set height of color indicator


      return () => {
        chart.dispose();
      };
    }
  }, [summedData, pieChartData]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value);
    setSelectedYear(year);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <select value={selectedYear || ''} onChange={handleYearChange} style={{ marginBottom: '20px' }}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Chart container for pie chart */}
      <div
        ref={chartDiv}
        style={{
          width: '80%',
          height: '300px',
          marginTop: '20px',
          maxWidth: '600px', // Optional: set a max width for the chart
        }}
      />
    </div>
  );
};

export default PieChart;
