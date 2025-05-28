import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, Loader2, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/datatable.css";

const DataTable = ({ filterUrl, activeFilters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 30;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the filter URL if provided, otherwise use the default endpoint
        const url = filterUrl || "http://localhost:8000/call/optionschain/5";
        
        console.log('Fetching data from:', url); // Debug log
        
        const response = await axios.get(url);
        
        // Handle different response structures
        let responseData = response.data;
        
        // If response is an object with a data property, use that
        if (responseData && typeof responseData === 'object' && responseData.data) {
          responseData = responseData.data;
        }
        
        // Ensure we have an array
        if (Array.isArray(responseData)) {
          setData(responseData);
          setTotalRecords(responseData.length); // Set total records from the full dataset
        } else {
          console.warn('Unexpected data format:', responseData);
          setData([]);
          setTotalRecords(0);
        }
        
        // Reset to first page when new data is fetched
        setCurrentPage(1);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        
        // More specific error messages
        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            setError("No data found for the selected filters");
          } else if (status === 500) {
            setError("Server error occurred while fetching data");
          } else {
            setError(`Error ${status}: ${error.response.data?.detail || 'Failed to load data'}`);
          }
        } else if (error.request) {
          setError("Unable to connect to the server. Please check if the backend is running.");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (filterUrl !== undefined) {
      fetchData();
    }
  }, [filterUrl]);

  // Pagination functions
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleRecords = () => {
    const startRecord = (currentPage - 1) * rowsPerPage + 1;
    const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);
    let records = ` Showing ${startRecord}-${endRecord} of ${totalRecords} records`;
    return records
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "-";
    
    // Handle string numbers
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    
    if (isNaN(numValue)) return "-";
    
    // if (numValue >= 1000000) {
    //   return (numValue / 1000000).toFixed(2) + "M";
    // } else if (numValue >= 1000) {
    //   return (numValue / 1000).toFixed(2) + "K";
    // }
    
    return numValue.toFixed(numValue % 1 === 0 ? 0 : 2);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    
    // If it's already in a readable format, return as is
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
      return dateStr;
    }
    
    // Otherwise, try to format it
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    
    // If time is in HH:MM:SS format, return as is
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      return timeStr;
    }
    
    return timeStr;
  };

  const getTableTitle = () => {
    if (!activeFilters) {
      return "Call Options Chain Analytics";
    }
    
    const { instrument, optionType, dataType } = activeFilters;
    return `${instrument} ${optionType} ${dataType} Data Analytics`;
  };

  const getTableSubtitle = () => {
    if (!activeFilters) {
      const startRecord = (currentPage - 1) * rowsPerPage + 1;
      const endRecord = Math.min(currentPage * rowsPerPage, totalRecords);
      return `Call Options Data for every 5 minutes | Showing ${startRecord}-${endRecord} of ${totalRecords} records`;
    }
    
    const { frequency, startDate, endDate } = activeFilters;
    
    let subtitle = `${frequency} minute frequency data`;
    
    if (startDate && endDate) {
      subtitle += ` from ${startDate} to ${endDate}`;
    } else {
      subtitle += " | Latest Data";
    }
    
    return subtitle;
  };

  const getTableHeaders = () => {
    if (!activeFilters || activeFilters.dataType === 'OptionsChain') {
      // Options Chain headers
      return (
        <tr>
          <th>Strike</th>
          <th>Expiry</th>
          <th>Buy Price</th>
          <th>Sell Price</th>
          <th>IV</th>
          <th>Volume</th>
          <th>OI</th>
          <th>Delta</th>
          <th>Theta</th>
          <th>Date</th>
          <th>Time</th>
        </tr>
      );
    } else {
      // Price data headers
      return (
        <tr>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Close</th>
          <th>Volume</th>
          <th>Date</th>
          <th>Time</th>
        </tr>
      );
    }
  };

  const getTableRow = (row, idx) => {
    if (!activeFilters || activeFilters.dataType === 'OptionsChain') {
      // Options Chain row
      return (
        <tr 
          key={`${row.strike}-${row.expiry}-${row.Time || row.time}-${idx}`}
          className={idx % 2 === 0 ? "even-row" : "odd-row"}
        >
          <td>{row.strike || "-"}</td>
          <td>{row.expiry || "-"}</td>
          <td className="positive">{formatNumber(row.buy_price || row.buyPrice)}</td>
          <td className="negative">{formatNumber(row.sell_price || row.sellPrice)}</td>
          <td>{formatNumber(row.iv || row.IV)}</td>
          <td>{formatNumber(row.volume)}</td>
          <td>{formatNumber(row.oi || row.OI)}</td>
          <td>{formatNumber(row.delta)}</td>
          <td>{formatNumber(row.theta)}</td>
          <td>{formatDate(row.Date || row.date)}</td>
          <td>{formatTime(row.Time || row.time)}</td>
        </tr>
      );
    } else {
      // Price data row
      return (
        <tr 
          key={`${row.open}-${row.close}-${row.Time || row.time}-${idx}`}
          className={idx % 2 === 0 ? "even-row" : "odd-row"}
        >
          <td className="positive">{formatNumber(row.open)}</td>
          <td className="positive">{formatNumber(row.high)}</td>
          <td className="negative">{formatNumber(row.low)}</td>
          <td>{formatNumber(row.close)}</td>
          <td>{formatNumber(row.volume)}</td>
          <td>{formatDate(row.Date || row.date)}</td>
          <td>{formatTime(row.Time || row.time)}</td>
        </tr>
      );
    }
  };

  if (loading) {
    return (
      <div className="data-table-container">
        <div className="loading-state">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span>Loading options data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-table-container">
        <div className="error-state">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-header">
        <div className="title-container">
          <TrendingUp className="header-icon" />
          <h2 className="table-title">{getTableTitle()}</h2>
        </div>
        <div className="table-info-row">
          <p className="table-subtitle">{getTableSubtitle()}</p>
          <p className="table-records">{handleRecords()} • Total Records: {data.length}</p>
        </div>

      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            {getTableHeaders()}
          </thead>
          <tbody>
            {getCurrentPageData().length > 0 ? (
              getCurrentPageData().map((row, idx) => getTableRow(row, idx))
            ) : (
              <tr>
                <td colSpan={activeFilters?.dataType === 'Price' ? 15 : 20} className="text-center">
                  No data available for the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalRecords > rowsPerPage && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>Total Rows: {getCurrentPageData().length}</span>
            <span>•</span>
            <span>Total Records: {totalRecords}</span>
          </div>
          <div className="pagination-controls">
            <button
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="pagination-icon" />
              Prev
            </button>
            <span className="pagination-current">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="pagination-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;