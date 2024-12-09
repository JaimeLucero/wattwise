import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTable: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20); // Rows per page set to 20
  const [totalRows, setTotalRows] = useState(0); // Total rows in the dataset

  const [filters, setFilters] = useState({
    year: '',
    month: '',
    day: '',
  });

  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'datetime',
    'Global_active_power',
    'Global_reactive_power',
    'Global_intensity',
    'Voltage',
    'consumer_id',
  ]);

  // Removed fetchData from useEffect, we now trigger fetch manually
  const fetchData = async () => {
    try {
      const offset = (currentPage - 1) * rowsPerPage;
  
      // Fetch the summary to get total rows only once if not already fetched
      if (totalRows === 0) {
        const summaryResponse = await axios.get(
          `https://wattwise-backend-12d84fc99403.herokuapp.com/api/summary`
        );
        setTotalRows(summaryResponse.data.total_rows);
      }
  
      // Fetch data for the current page
      const response = await axios.get(
        `https://wattwise-backend-12d84fc99403.herokuapp.com/api/full_query?limit=${rowsPerPage}&offset=${offset}&columns=${selectedColumns.join(',')}`
      );
  
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  // Refetch data whenever currentPage or selectedColumns changes
  useEffect(() => {
    fetchData();
  }, [currentPage, selectedColumns]);
  
  
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Handle column selection
  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const column = e.target.name;
    setSelectedColumns((prevColumns) =>
      e.target.checked
        ? [...prevColumns, column]
        : prevColumns.filter((col) => col !== column)
    );
  };

  const formatValue = (value: any) => {
    return value !== undefined && value !== null ? value.toFixed(2) : 'N/A';
  };

  // Generate months and days for the dropdown
  const generateMonthOptions = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(i.toString());
    }
    return months;
  };

  const generateDayOptions = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString());
    }
    return days;
  };

  // Generate a range of years (e.g., 2000 to 2024)
  const generateYearOptions = () => {
    const years = [];
    for (let i = 2006; i <= 2010; i++) {
      years.push(i.toString());
    }
    return years;
  };
  

  return (
    <div style={{ width: '100%', margin: '0 auto', paddingTop: '20px', overflowX: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Metric’s Total Consumption Table</h2>
      <h3
        style={{
          marginTop: '10px',
          fontSize: '1rem',
          fontWeight: 'regular',
        }}
      >
        Click search to display the table
      </h3>
      {/* Filter Dropdowns for Year, Month, and Day */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <label>
          Year:
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
          >
            <option value="">Select Year</option>
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label>
          Month:
          <select
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
          >
            <option value="">Select Month</option>
            {generateMonthOptions().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label>
          Day:
          <select
            name="day"
            value={filters.day}
            onChange={handleFilterChange}
          >
            <option value="">Select Day</option>
            {generateDayOptions().map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>
        {/* Search button triggers data fetch */}
        <button onClick={fetchData}>Search</button>
      </div>

      {/* Column Selection Checkboxes */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
      <label>
          <input
            type="checkbox"
            name="datetime"
            checked={selectedColumns.includes('datetime')}
            onChange={handleColumnChange}
          />
          Date/Time
        </label>
        <label>
          <input
            type="checkbox"
            name="Global_active_power"
            checked={selectedColumns.includes('Global_active_power')}
            onChange={handleColumnChange}
          />
          Global Active Power (kW)
        </label>
        <label>
          <input
            type="checkbox"
            name="Global_reactive_power"
            checked={selectedColumns.includes('Global_reactive_power')}
            onChange={handleColumnChange}
          />
          Global Reactive Power (kW)
        </label>
        <label>
          <input
            type="checkbox"
            name="Global_intensity"
            checked={selectedColumns.includes('Global_intensity')}
            onChange={handleColumnChange}
          />
          Global Intensity (A)
        </label>
        <label>
          <input
            type="checkbox"
            name="Voltage"
            checked={selectedColumns.includes('Voltage')}
            onChange={handleColumnChange}
          />
          Voltage (V)
        </label>
        <label>
          <input
            type="checkbox"
            name="consumer_id"
            checked={selectedColumns.includes('consumer_id')}
            onChange={handleColumnChange}
          />
          Consumer ID
        </label>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: '20px 0',
            minWidth: '600px',
          }}
        >
          <thead>
            <tr>
              {selectedColumns.includes('datetime') && (
                <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left', background: '#f5f5f5', fontWeight: 'bold' }}>
                  Date/Time
                </th>
              )}
              {selectedColumns.includes('Global_active_power') && (
                <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left', background: '#f5f5f5', fontWeight: 'bold' }}>
                  Global Active Power (kW)
                </th>
              )}
              {selectedColumns.includes('Global_reactive_power') && (
                <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left', background: '#f5f5f5', fontWeight: 'bold' }}>
                  Global Reactive Power (kW)
                </th>
              )}
              {selectedColumns.includes('Global_intensity') && (
                <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left', background: '#f5f5f5', fontWeight: 'bold' }}>
                  Global Intensity (A)
                </th>
              )}
              {selectedColumns.includes('Voltage') && (
                <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left', background: '#f5f5f5', fontWeight: 'bold' }}>
                  Voltage (V)
                </th>
              )}
              {selectedColumns.includes('consumer_id') && (
                <th style={{ border: '1px solid #5B5B5B', padding: '8px', textAlign: 'left', background: '#f5f5f5', fontWeight: 'bold' }}>
                  Consumer ID
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  {selectedColumns.includes('datetime') && (
                    <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                      {new Date(item.datetime).toLocaleString()}
                    </td>
                  )}
                  {selectedColumns.includes('Global_active_power') && (
                    <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                      {formatValue(item.Global_active_power)}
                    </td>
                  )}
                  {selectedColumns.includes('Global_reactive_power') && (
                    <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                      {formatValue(item.Global_reactive_power)}
                    </td>
                  )}
                  {selectedColumns.includes('Global_intensity') && (
                    <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                      {formatValue(item.Global_intensity)}
                    </td>
                  )}
                  {selectedColumns.includes('Voltage') && (
                    <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                      {formatValue(item.Voltage)}
                    </td>
                  )}
                  {selectedColumns.includes('consumer_id') && (
                    <td style={{ border: '1px solid #5B5B5B', padding: '8px' }}>
                      {item.consumer_id}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={selectedColumns.length} style={{ textAlign: 'center', padding: '8px' }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;