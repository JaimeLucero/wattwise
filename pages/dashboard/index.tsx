import Header from "@components/header/Header";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarGraph from "@components/linegraph/Bargraph";
import ForecastVisualization from "@components/forecasting/Forecasting";

const Dashboard = () => {
    const [yearValueTrend, setYearValueTrend] = useState<string>('');
    const [monthValue, setMonthValue] = useState<string>('');
    const [dayValue, setDayValue] = useState<string>('');
    const [metricValue, setMetricValue] = useState<string>('Global_active_power');
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [yearValueInsight, setYearValueInsight] = useState<string>('');    
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [fetchedData, setFetchedData] = useState<any[]>([]);
    const [peakSales, setPeakSales] = useState<number | null>(null);  // State for peak usage
    const [peakMonth, setPeakMonth] = useState<string>(null);  // State for peak usage
    const [totalAnnualSales, setTotalAnnualSales] = useState<number | null>(null); // State for total sales
    const [avgMonthlySales, setAvgMonthlySales] = useState<number | null>(null); // State for average monthly sales
    const [percentageChange, setPercentageChange] = useState<number | null>(null); // State for percentage change
    const [peakVsAvgSalesDifference, setPeakVsAvgSalesDifference] = useState<number | null>(null); // State for peak vs average sales difference
    const [salesDifferenceInsight, setSalesDifferenceInsight] = useState<string>(''); // Insight for sales difference
    const [competitorSalesInsight, setCompetitorSalesInsight] = useState('');
    const [competitorSalesColor, setCompetitorSalesColor] = useState('');


    // Rate per kWh (set the rate according to your pricing)
    const ratePerKWh = 0.10;

    // Fetch data on initial load
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://wattwise-backend-12d84fc99403.herokuapp.com/api/full_query?columns=datetime,Global_active_power');
          const data = response.data;
  
          // Extract unique years as string[]
          const years = Array.from(
            new Set(
              data.map((item: any) => {
                const date = new Date(item.datetime);
                return date.getFullYear().toString(); // Ensure it's a string
              })
            )
          ).sort() as string[]; // Assert that the result is a string array

          // Set the latest year as the default year
          const latestYear = years[years.length - 1] || '';
          setAvailableYears(years);
          setYearValueInsight(latestYear); // Set default year to the latest one
          setFetchedData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

    // Update months when a year is selected
    useEffect(() => {
      if (yearValueTrend !== '') {
        const months = Array.from(
          new Set(
            fetchedData
              .filter((item: any) => new Date(item.datetime).getFullYear().toString() === yearValueTrend)
              .map((item: any) => {
                const date = new Date(item.datetime);
                return (date.getMonth() + 1).toString().padStart(2, '0');
              })
          )
        );
        setAvailableMonths(months.sort());
        setMonthValue(''); // Reset month and day when year changes
        setDayValue('');
        setAvailableDays([]);
      }
    }, [yearValueTrend]);
  
    // Update days when a month is selected
    useEffect(() => {
      if (monthValue !== '' && yearValueTrend !== '') {
        const days = Array.from(
          new Set(
            fetchedData
              .filter((item: any) => {
                const date = new Date(item.datetime);
                return (
                  date.getFullYear().toString() === yearValueTrend &&
                  (date.getMonth() + 1).toString().padStart(2, '0') === monthValue
                );
              })
              .map((item: any) => {
                const date = new Date(item.datetime);
                return date.getDate().toString().padStart(2, '0');
              })
          )
        );
        setAvailableDays(days.sort());
        setDayValue(''); // Reset day when month changes
      }
    }, [monthValue, yearValueTrend]);
  

    useEffect(() => {
        if (yearValueInsight !== '') {
          const calculateAnnualStats = () => {
            const yearData = fetchedData.filter((item: any) => {
              const date = new Date(item.datetime);
              return date.getFullYear().toString() === yearValueInsight;
            });
      
            // Calculate total kWh for the current year
            const totalKWh = yearData.reduce((acc: number, item: any) => {
              const activePower = parseFloat(item.Global_active_power);
              return acc + (activePower || 0);
            }, 0);
      
            // Calculate total sales
            const totalSales = totalKWh * ratePerKWh;
            const avgMonthlySales = (totalKWh / 12) * ratePerKWh;
      
            // Previous year sales and percentage change calculation
            const previousYear = (parseInt(yearValueInsight) - 1).toString();
            const previousYearData = fetchedData.filter((item: any) => {
              const date = new Date(item.datetime);
              return date.getFullYear().toString() === previousYear;
            });
            
            const previousYearKWh = previousYearData.reduce((acc: number, item: any) => {
              const activePower = parseFloat(item.Global_active_power);
              return acc + (activePower || 0);
            }, 0);
      
            const previousYearSales = previousYearKWh * ratePerKWh;
            let percentageChange = 0;
            if (previousYearSales > 0) {
              percentageChange = ((totalSales - previousYearSales) / previousYearSales) * 100;
            }
      
            // Find peak sales per month
            let peakMonth = '';
            let peakSales = 0;
            const monthlySales: { [key: string]: number } = {};
            yearData.forEach((item: any) => {
              const activePower = parseFloat(item.Global_active_power) || 0;
              const date = new Date(item.datetime);
              const month = date.getMonth();
              const sales = activePower * ratePerKWh;
              const monthName = new Date(0, month).toLocaleString('default', { month: 'long' });
              if (monthlySales[monthName]) {
                monthlySales[monthName] += sales;
              } else {
                monthlySales[monthName] = sales;
              }
            });
      
            // Find peak sales month
            Object.keys(monthlySales).forEach((monthName) => {
              if (monthlySales[monthName] > peakSales) {
                peakSales = monthlySales[monthName];
                peakMonth = monthName;
              }
            });
      
            // Calculate percentage difference between peak and average sales
            const peakVsAvgSalesDifference = avgMonthlySales > 0 ? ((peakSales - avgMonthlySales) / avgMonthlySales) * 100 : 0;
      
            // Set state for insights
            setTotalAnnualSales(totalSales);
            setAvgMonthlySales(avgMonthlySales);
            setPeakSales(peakSales);
            setPeakMonth(peakMonth);
            setPercentageChange(percentageChange);
            setPeakVsAvgSalesDifference(peakVsAvgSalesDifference);
      
            let insightMessage = '';
            if (peakVsAvgSalesDifference > 0) {
              insightMessage = `Peak sales are ${peakVsAvgSalesDifference.toFixed(2)}% higher than average monthly sales.`;
            } else if (peakVsAvgSalesDifference < 0) {
              insightMessage = `Peak sales are ${Math.abs(peakVsAvgSalesDifference).toFixed(2)}% lower than average monthly sales.`;
            } else {
              insightMessage = 'Peak sales are equal to the average monthly sales.';
            }
      
            setSalesDifferenceInsight(insightMessage);
      
            // Mock competitor sales data
            const competitorSales = 30000;  // Mock value for competitor's total sales
            const competitorPercentageDifference = competitorSales > 0 ? ((avgMonthlySales - competitorSales) / competitorSales) * 100 : 0;
      
            // Set competitor sales insight
            let competitorInsightMessage = '';
            if (competitorPercentageDifference > 0) {
              competitorInsightMessage = `You are ${competitorPercentageDifference.toFixed(2)}% higher than the competitor in monthly average sales.`;
            } else if (competitorPercentageDifference < 0) {
              competitorInsightMessage = `You are ${Math.abs(competitorPercentageDifference).toFixed(2)}% lower than the competitor in monthly average sales.`;
            } else {
              competitorInsightMessage = 'Your total sales are equal to the competitor’s monthly average sales.';
            }
      
            setCompetitorSalesInsight(competitorInsightMessage); // Assume you have a state like setCompetitorSalesInsight
            // Determine color based on competitor sales percentage difference
            const competitorInsightColor = competitorPercentageDifference !== null && competitorPercentageDifference > 0 ? 'green' : 'red';

            // You can now use this color in your JSX
            // Example:
            setCompetitorSalesColor(competitorInsightColor);  // Assume you have a state like setCompetitorSalesColor

          };
      
          calculateAnnualStats();
        }
      }, [yearValueInsight, fetchedData]);
      

    const handleYearTrend = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = event.target.value;
        setYearValueTrend(selectedYear);
        if (selectedYear === '') {
          setMonthValue(''); // Reset month when year is 'None'
          setDayValue(''); // Reset day when year is 'None'
        }
      };

    const handleYearInsight = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = event.target.value;
        setYearValueInsight(selectedYear);  // Update the state with the selected year
    };
    
    const handleMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = event.target.value;
        setMonthValue(selectedMonth);
        if (selectedMonth === '') {
            setDayValue(''); // Reset day when month is 'None'
        }
    };

    const handleDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setDayValue(event.target.value);
    };

    const handleMetric = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setMetricValue(event.target.value);
    };
    
    const formatMetric = (metricValue: string) => {
        return metricValue
          .replace(/_/g, ' ')                 // Replace underscores with spaces
          .split(' ')                         // Split the string into an array of words
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
          .join(' ');                         // Join the words back into a string with spaces
      };

  return (
    <main
    style={{
        backgroundColor: '#FFFBDE',  // Set your desired background color here
        height: '100%',  // Full viewport height
        padding: 0,
        margin: 0,
        display: 'flex',  // Flexbox container
        flexDirection: 'column',
        textAlign: 'center',      // Center align text inside the container
      }}
    >
        <Header/>
        <h1
        style={{
          padding: 20,
          position: 'relative',
          color: 'black',           // Set text color to make it visible
          fontSize: '2rem',
          fontWeight: 'bold',  
          fontFamily: 'Istok Web',
        }}
        >
          Dashboard
        </h1>
        <h1
        style={{
          padding: 20,
          position: 'relative',
          color: 'black',           // Set text color to make it visible
          fontSize: '2rem',
          fontWeight: 'normal',  
          fontFamily: 'Istok Web',
          alignSelf: 'left',
          textAlign: 'left'
        }}
        >
            Consumption Sales
        </h1>

        <div style={{ padding: '20px' }}>
            <label htmlFor="year" style={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>Select Insights Year: </label>
            <select
                id="year"
                value={yearValueInsight}
                onChange={handleYearInsight}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: '2px solid #4CAF50',  // Green border
                    backgroundColor: '#4CAF50',   // Green background
                    color: 'white',                // White text color
                    borderRadius: '5px',          // Rounded corners
                    cursor: 'pointer',            // Pointer cursor on hover
                    outline: 'none',              // Remove default outline
                    transition: 'all 0.3s ease',  // Smooth transition for hover effect
                }}
            >
                <option value="">None</option>
                {availableYears.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between', // Space out the divs
                gap: '10px',                     // Optional: Add space between divs
                width: '100%',                   // Make sure the container takes up the full width
                padding: '20px',                 // Optional: Add padding to the container
            }}
            >
            <div
                style={{
                width: '30%',                   // Each div takes up 30% of the container width
                height: '20vh',                // Set the height of the divs
                backgroundColor: '#F8E877',   // Background color for the first div
                borderRadius: '10px',           // Add rounded corners
                justifyContent: 'center',       // Horizontally center the content
                outline: '3px solid black',     // Add an outline
                }}
            >
                <h1
                style={{
                padding: 20,
                position: 'relative',
                color: 'black',           // Set text color to make it visible
                fontSize: '1.3rem',
                fontWeight: 'bold',  
                fontFamily: 'Istok Web',
                textAlign: 'center',
                }}
                >
                    Total Annual Sales:
                </h1>
                <h1
                style={{
                padding: 20,
                position: 'relative',
                color: 'black',           // Set text color to make it visible
                fontSize: '1.3rem',
                fontWeight: 'bold',  
                fontFamily: 'Istok Web',
                textAlign: 'center',
                }}
                >
                    $ {totalAnnualSales?.toFixed(2) || '0.00'} 
                </h1>
                {percentageChange !== null && (
                    <h2
                        style={{
                            padding: 5,
                            color: percentageChange >= 0 ? 'green' : 'red',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            fontFamily: 'Istok Web',
                        }}
                    >
                        {percentageChange >= 0 ? 'Increase' : 'Decrease'} in Annual Sales from the Previous Year: {percentageChange.toFixed(2)}%
                    </h2>
                )}
            </div>
            <div
                style={{
                width: '30%',                   // Each div takes up 30% of the container width
                height: '20vh',                // Set the height of the divs
                backgroundColor: '#F8E877',   // Background color for the first div
                borderRadius: '10px',           // Add rounded corners
                justifyContent: 'center',       // Horizontally center the content
                outline: '3px solid black',     // Add an outline
                }}
            >
                <h1
                style={{
                padding: 20,
                position: 'relative',
                color: 'black',           // Set text color to make it visible
                fontSize: '1.3rem',
                fontWeight: 'bold',  
                fontFamily: 'Istok Web',
                textAlign: 'center',
                }}
                >
                    Peak Sales:
                </h1>
                <h1
                    style={{
                    padding: 20,
                    position: 'relative',
                    color: 'black',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    fontFamily: 'Istok Web',
                    textAlign: 'center',
                    }}
                >
                    <p>$ {peakSales?.toFixed(2) || '0.00'}</p>
                    <p>{peakMonth}, {yearValueInsight}</p>
                </h1>
                <h2
                    style={{
                    padding: 5,
                    color: peakVsAvgSalesDifference !== null && peakVsAvgSalesDifference > 0 ? 'green' : 'red',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    fontFamily: 'Istok Web',
                    }}
                >
                    {salesDifferenceInsight}
                </h2>
            </div>
            <div
                style={{
                width: '30%',                   // Each div takes up 30% of the container width
                height: '20vh',                // Set the height of the divs
                backgroundColor: '#F8E877',   // Background color for the first div
                borderRadius: '10px',           // Add rounded corners
                justifyContent: 'center',       // Horizontally center the content
                outline: '3px solid black',     // Add an outline
                }}
            >
                <h1
                style={{
                padding: 20,
                position: 'relative',
                color: 'black',           // Set text color to make it visible
                fontSize: '1.3rem',
                fontWeight: 'bold',  
                fontFamily: 'Istok Web',
                textAlign: 'center',
                }}
                >
                    Average Monthly Sales:
                </h1>
                <h1
                style={{
                padding: 20,
                position: 'relative',
                color: 'black',           // Set text color to make it visible
                fontSize: '1.3rem',
                fontWeight: 'bold',  
                fontFamily: 'Istok Web',
                textAlign: 'center',
                }}
                >
                   $ {avgMonthlySales?.toFixed(2) || '0.00'}
                </h1>
                <h2
                    style={{
                    padding: 5,
                    color:competitorSalesColor,
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    fontFamily: 'Istok Web',
                    }}
                >
                    {competitorSalesInsight}
                </h2>
            </div>
        </div>

        <div
            style={{
                margin: '20px',
                width: '90vw',
                height: '100%',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
                outline: '3px solid black',     // Add an outline

            }}
            >
            <h1
                style={{
                    margin: '30px',
                    fontSize: '2rem',
                    fontWeight: 'regular'
                }}
                >
                    {formatMetric(metricValue)} Consumption Trends
                </h1>
            <div
            style={{
                display: 'flex',
                gap: '10px',
                margin: '20px'
            }}
            >
                <div>
                <label>Year:</label>
                <select id="yearDropdown" value={yearValueTrend} onChange={handleYearTrend}>
                    <option value="">None</option>
                    {availableYears.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                    ))}
                </select>
                </div>
                <div>
                <label>Month:</label>
                <select
                    id="monthDropdown"
                    value={monthValue}
                    onChange={handleMonth}
                    disabled={yearValueTrend === ''}>
                    <option value="">None</option>
                    {availableMonths.map((month) => (
                    <option key={month} value={month}>
                        {month}
                    </option>
                    ))}
                </select>
                </div>
                <div>
                <label>Day:</label>
                <select
                    id="dayDropdown"
                    value={dayValue}
                    onChange={handleDay}
                    disabled={yearValueTrend === '' || monthValue === ''}>
                    <option value="">None</option>
                    {availableDays.map((day) => (
                    <option key={day} value={day}>
                        {day}
                    </option>
                    ))}
                </select>
                </div>
            <div>
                <label>Metric:</label>
                <select id="metricDropdown" value={metricValue} onChange={handleMetric}>
                <option value="Global_active_power">Global Active Power</option>
                <option value="Global_reactive_power">Global Reactive Power</option>
                <option value="Voltage">Voltage</option>
                <option value="Global_intensity">Global Intensity</option>
                </select>
            </div>
            </div>
            <div
            style={{
                height: '100%',
                alignSelf: 'center'
            }}
            >
                <BarGraph year={yearValueTrend} month={monthValue} day={dayValue} metric={metricValue} userid=''/>
            </div>
        </div>
        <div
        style={{
            margin: '20px',
            width: '90vw',
            height: '100%',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'center',
            outline: '3px solid black',     // Add an outline

        }}>
            <ForecastVisualization/>
        </div>
    </main>
  );
};

export default Dashboard;
