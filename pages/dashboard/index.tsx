import React, { useState, useEffect } from 'react';
import Header from '@components/header/Header'
import Linegraph from '@components/linegraph/Linegraph'
import DataTable from '@components/table/Table';
import axios from 'axios';
import PieChart from '@components/piechart/Piechart';
import PowerCostCalculator from '@components/cost/Cost';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ConsumerInsights from '@components/monthly-insights/MonthlyInsights';

const Dashboard = () => {

    const [yearValue, setYearValue] = useState<string>('');
    const [monthValue, setMonthValue] = useState<string>('');
    const [dayValue, setDayValue] = useState<string>('');
    const [metricValue, setMetricValue] = useState<string>('Global_active_power');
  
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [fetchedData, setFetchedData] = useState<any[]>([]);

    // New state for input fields
    const [accountNumberValue, setAccountNumberValue] = useState<string>('');
    const [searchPressed, setSearchPressed] = useState<boolean>(false); // Track search button status

  
    // Fetch data on initial load
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5000/api/full_query?columns=datetime');
          const data = response.data;
  
          // Extract unique years
          const years = Array.from(
            new Set(
              data.map((item: any) => {
                const date = new Date(item.datetime);
                return date.getFullYear().toString();
              })
            )
          );
          setAvailableYears(years.sort());
          setFetchedData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    // Update months when a year is selected
    useEffect(() => {
      if (yearValue !== '') {
        const months = Array.from(
          new Set(
            fetchedData
              .filter((item: any) => new Date(item.datetime).getFullYear().toString() === yearValue)
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
    }, [yearValue]);
  
    // Update days when a month is selected
    useEffect(() => {
      if (monthValue !== '' && yearValue !== '') {
        const days = Array.from(
          new Set(
            fetchedData
              .filter((item: any) => {
                const date = new Date(item.datetime);
                return (
                  date.getFullYear().toString() === yearValue &&
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
    }, [monthValue, yearValue]);
  
    const handleYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedYear = event.target.value;
        setYearValue(selectedYear);
        if (selectedYear === '') {
          setMonthValue(''); // Reset month when year is 'None'
          setDayValue(''); // Reset day when year is 'None'
        }
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
    
    const handleAccountNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNumberValue(event.target.value);
    };


    // New search button handler
    const handleSearch = () => {
        console.log('Search clicked with the following values:');
        console.log('Account Number:', accountNumberValue);
    
        setSearchPressed(true); // Set to true when search is clicked
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
        <div
        style={{
            width: '100%',
            boxShadow: '4px 8px 16px rgba(0, 0, 0, 0.2)', // A stronger shadow effect
        }}>
            <Header/>
        </div>
        <h1
        style={{
            fontSize: '3rem',
            fontWeight: 'normal',
            whiteSpace: 'nowrap',
            fontFamily: 'Istok Web',
            textAlign: 'left',
            paddingLeft: '20px'
          }}
        >
            Dashboard
        </h1>
        <div
        style={{
            display: 'flex',
            alignItems: 'center'
        }}
        >
            <h1
            style={{
                fontSize: '1rem',
                fontWeight: 'normal',
                whiteSpace: 'nowrap',
                fontFamily: 'Istok Web',
                textAlign: 'left',
                paddingLeft: '20px',
                paddingRight: '20px'
            }}
            >
                Account Number:
            </h1>
            <input
                type="text"
                placeholder="Enter account number"
                value={accountNumberValue}
                onChange={handleAccountNumberChange}
                style={{
                    padding: '8px',               // Padding inside the input box
                    border: '2px solid #000',      // Border with a solid color (black)
                    borderRadius: '50px',          // Rounded corners with 10px radius
                    outline: 'none',               // Remove default outline on focus
                    fontSize: '16px',              // Font size
                    backgroundColor: 'transparent',    // Make the background transparent
                    width: '20vw'
                }}
                />
            <button
                style={{
                    padding: '10px 20px',                // Padding inside the button
                    marginLeft: '20px',                   // Space between the button and input fields
                    border: '2px solid #000',             // Button border color
                    borderRadius: '50px',                 // Rounded corners
                    backgroundColor: '#000',              // Button background color
                    color: '#fff',                        // Button text color
                    fontSize: '16px',                     // Font size
                    cursor: 'pointer',                   // Pointer cursor on hover
                }}
                onClick={handleSearch}  // Trigger search on button click
            >
            Search
            </button>
        </div>
        {!searchPressed && ( // Render layout only if searchPressed is false
        <>
            <div
            style={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'center',
                paddingTop: '30px',
                height: '40vh',
                width: '1000px',
                justifyContent: 'space-between'
            }}
            >
                <div
                style={{
                    background: '#B2EFFF',
                    width: '40vh',
                    height: '100%',
                    borderRadius: '40px'
                }}  
                >
                    <PowerCostCalculator/>
                </div>

                <div
                style={{
                    background: '#FCF4B6',
                    width: '40vh',
                    height: '100%',
                    borderRadius: '40px'
                }}  
                >
                    <h1
                        style={{
                            margin: '10px',
                            fontSize: '2rem'
                        }}
                        >
                            Total Consumption
                    </h1>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            alignSelf: 'center'
                        }}
                    >
                        <PieChart/>
                    </div>

                </div>
            </div>
            <div
            style={{
                margin: '20px',
                width: '1000px',
                height: '100%',
                background: 'rgba(85, 85, 85, 0.3)',/* 50% opacity */
                borderRadius: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center'
            }}
            >
            <h1
                style={{
                    margin: '10px',
                    fontSize: '2rem',
                    fontWeight: 'regular'
                }}
                >
                    Power Consumption 
                </h1>
            <div
            style={{
                display: 'flex',
                gap: '10px',
            }}
            >
                <div>
                <label>Year:</label>
                <select id="yearDropdown" value={yearValue} onChange={handleYear}>
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
                    disabled={yearValue === ''}>
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
                    disabled={yearValue === '' || monthValue === ''}>
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
                width: '100%',
                paddingLeft: '45px',
                alignSelf: 'center'
            }}
            >
                <Linegraph year={yearValue} month={monthValue} day={dayValue} metric={metricValue} userid=''/>
            </div>
        </div>
        
        <div
            style={{
                margin: '20px',
                width: '1000px',
                height: '100%',
                background: '#D9D9D9',/* 50% opacity */
                borderRadius: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
                padding: '20px'
            }}
        >
            <DataTable userid=''/>
        </div>
        </>)}
        {searchPressed &&(
        <>
            <div
            style={{
                margin: '20px',
                width: '1000px',
                height: '100%',
                background: 'rgba(85, 85, 85, 0.3)',/* 50% opacity */
                borderRadius: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center'
            }}
            >
            <h1
                style={{
                    margin: '10px',
                    fontSize: '2rem',
                    fontWeight: 'regular'
                }}
                >
                    Power Consumption 
                </h1>
            <div
            style={{
                display: 'flex',
                gap: '10px',
            }}
            >
                <div>
                <label>Year:</label>
                <select id="yearDropdown" value={yearValue} onChange={handleYear}>
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
                    disabled={yearValue === ''}>
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
                    disabled={yearValue === '' || monthValue === ''}>
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
                height: '450px',
                width: '100%',
                paddingLeft: '45px',
                alignSelf: 'center'
            }}
            >
                <Linegraph year={yearValue} month={monthValue} day={dayValue} metric={metricValue} userid={accountNumberValue} />
            </div>
        </div>

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'center',
                paddingTop: '30px',
                paddingBottom: '30px',
                height: '60vh',
                width: '1000px',
                justifyContent: 'space-between'
            }}
            >
                <div
                style={{
                    background: '#FCF4B6',
                    width: '40vh',
                    height: '100%',
                    borderRadius: '40px'
                }}  
                >
                </div>

                <div
                style={{
                    background: '#B2EFFF',
                    width: '40vh',
                    height: '100%',
                    borderRadius: '40px'
                }}  
                >
                    <h1
                        style={{
                            margin: '10px',
                            fontSize: '2rem'
                        }}
                        >
                    </h1>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            alignSelf: 'center'
                        }}
                    >
                        <ConsumerInsights userId={accountNumberValue}/>
                    </div>

                </div>
            </div>
        
        <div
            style={{
                margin: '20px',
                width: '1000px',
                height: '100%',
                background: '#D9D9D9',/* 50% opacity */
                borderRadius: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
                padding: '20px'
            }}
        >
            <DataTable userid={accountNumberValue}/>
        </div>
        </>
        )}
    </main>
  );
};

export default Dashboard;
