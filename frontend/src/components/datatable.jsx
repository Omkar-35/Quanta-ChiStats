import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, Loader2, TrendingUp } from "lucide-react";
import "../styles/datatable.css";

const DataTable = ({ filterUrl, activeFilters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the filter URL if provided, otherwise use the default endpoint
        const url = filterUrl || "http://localhost:8000/call/optionschain/5";
        
        const response = await axios.get(url);
        setData(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load options data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterUrl]);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "-";
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K";
    }
    
    return num.toFixed(num % 1 === 0 ? 0 : 2);
  };

  const getTableTitle = () => {
    if (!activeFilters) {
      return "Call Options Chain Analytics";
    }
    return `${activeFilters.instrument} ${activeFilters.optionType} Options ${activeFilters.dataType} Data Analytics`;
  };

  const getTableSubtitle = () => {
    if (!activeFilters) {
      return "Call Options Data for every 5 minutes";
    }
    
    let subtitle = `${activeFilters.frequency} minute frequency data`;
    
    if (activeFilters.startDate && activeFilters.endDate) {
      subtitle += ` from ${activeFilters.startDate} to ${activeFilters.endDate}`;
    } else {
      subtitle += " | Real-time data refreshed every 5 minutes";
    }
    
    return subtitle;
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
        <p className="table-subtitle">
          {getTableSubtitle()}
        </p>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
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
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr 
                  key={`${row.strike}-${row.expiry}-${row.Time}-${idx}`}
                  className={idx % 2 === 0 ? "even-row" : "odd-row"}
                >
                  <td>{row.strike}</td>
                  <td>{row.expiry}</td>
                  <td className="positive">{formatNumber(row.buy_price)}</td>
                  <td className="negative">{formatNumber(row.sell_price)}</td>
                  <td>{formatNumber(row.iv)}</td>
                  <td>{formatNumber(row.volume)}</td>
                  <td>{formatNumber(row.oi)}</td>
                  <td>{formatNumber(row.delta)}</td>
                  <td>{formatNumber(row.theta)}</td>
                  <td>{row.Date}</td>
                  <td>{row.Time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;