import React, { useState, useEffect } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import '../styles/filters.css';

const Filters = ({ onFetch = () => {} }) => {
  const [instrument, setInstrument] = useState('NIFTY');
  const [optionType, setOptionType] = useState('Call');
  const [frequency, setFrequency] = useState('5');
  const [dataType, setDataType] = useState('OptionsChain');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');
  const [loading, setLoading] = useState(false);

  const buildFilterUrl = () => {
    let baseUrl = 'http://localhost:8000/filter';
    
    // Add option type (lowercase for URL)
    baseUrl += `/${optionType.toLowerCase()}`;
    
    // Add data type
    if (dataType === 'OptionsChain') {
      baseUrl += '/optionschain';
    } else {
      baseUrl += '/price';
    }
    
    // Add frequency (remove 'min' if present)
    baseUrl += `/${frequency.replace('min', '')}`;
    
    // Add date filters if both dates are selected
    if (startDate && endDate) {
      // Convert dates to DD-MM-YYYY format
      const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
      };
      
      baseUrl += `?start=${formatDate(startDate)}&end=${formatDate(endDate)}`;
    }
    
    return baseUrl;
  };

  const getDefaultUrl = () => {
    return 'http://localhost:8000/call/optionschain/5';
  };

  const handleFetch = async () => {
    try {
      setLoading(true);
      const url = buildFilterUrl();
      
      // Pass the URL and filter data to parent component
      onFetch({
        url,
        filters: {
          instrument,
          optionType,
          frequency,
          dataType,
          startDate,
          endDate,
        }
      });
    } catch (error) {
      console.error('Error building filter URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setInstrument('NIFTY');
    setOptionType('Call');
    setFrequency('5');
    setDataType('OptionsChain');
    setStartDate('');
    setEndDate('');
    
    // Fetch default data
    onFetch({
      url: getDefaultUrl(),
      filters: {
        instrument: 'NIFTY',
        optionType: 'Call',
        frequency: '5',
        dataType: 'OptionsChain',
        startDate: '',
        endDate: '',
      }
    });
  };

  const handleReadMeOpen = () => setShowModal(true);
  const handleReadMeClose = () => setShowModal(false);

  // Load default data when component mounts
  useEffect(() => {
    onFetch({
      url: getDefaultUrl(),
      filters: {
        instrument,
        optionType,
        frequency,
        dataType,
        startDate,
        endDate,
      }
    });
  }, []);

  useEffect(() => {
    fetch('/readme.txt')
      .then(res => res.text())
      .then(setReadmeContent)
      .catch(err => setReadmeContent('Failed to load Read Me.'));
  }, []);

  return (
    <>
      <div className="filters-container">
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="instrument">Instrument</label>
            <select 
              id="instrument"
              value={instrument} 
              onChange={(e) => setInstrument(e.target.value)}
            >
              <option value="NIFTY">NIFTY</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="optionType">Option Type</label>
            <select 
              id="optionType"
              value={optionType} 
              onChange={(e) => setOptionType(e.target.value)}
            >
              <option value="Call">Call</option>
              <option value="Put">Put</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="dataType">Data Type</label>
            <select 
              id="dataType"
              value={dataType} 
              onChange={(e) => setDataType(e.target.value)}
            >
              <option value="Price">Price</option>
              <option value="OptionsChain">Options Chain</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="frequency">Frequency</label>
            <select 
              id="frequency"
              value={frequency} 
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="1">1 min</option>
              <option value="5">5 min</option>
            </select>
          </div>
        </div>

        <div className="filters-row">
          <div className='date-range'>
            <div className="filter-group">
              <label htmlFor="startDate">Start Date</label>
              <input 
                id="startDate" 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                min="2023-08-01"
                max="2025-04-01"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">End Date</label>
              <input 
                id="endDate" 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                min="2023-08-01"
                max="2025-04-01"
              />
            </div>
          </div>

          <div className="actions-group">
            <button 
              className="fetch-button" 
              onClick={handleFetch}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch'}
            </button>
            
            <button 
              className="clear-button" 
              onClick={handleClearFilters}
              title="Clear all filters and load default data"
            >
              <RotateCcw size={16} />
              <span>Clear</span>
            </button>
            
            <span onClick={handleReadMeOpen} className="readme-link">
              <Info size={16} />
              <span>Read Me</span>
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={handleReadMeClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Options Chain Analytics - Documentation</h3>
              <button className="close-button" onClick={handleReadMeClose}>×</button>
            </div>
            <div className="modal-body">
              <div className="readme-content">
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {readmeContent}
                </pre>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleReadMeClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;