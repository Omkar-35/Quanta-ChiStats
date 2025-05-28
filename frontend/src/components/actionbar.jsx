import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import '../styles/actionbar.css';
import { FaSyncAlt, FaFileCsv, FaGavel } from 'react-icons/fa';
import { FiMaximize } from 'react-icons/fi';

const ActionBar = ({ viewMode, onToggleView, isBestView, onToggleBestView, filterUrl }) => {
  const [data, setData] = useState({
    underlyingIndex: 'NIFTY',
    value: 0,
    timestamp: '',
  });
  const [showTermsModal, setShowTermsModal] = useState(false);

  const fetchLiveData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/nse-market-status');
    const json = await response.json();

    // Find Capital Market entry with NIFTY 50 index
    const marketData = json.marketState.find(
      item => item.market === 'Capital Market' && item.index === 'NIFTY 50'
    );

    if (marketData) {
      setData({
        underlyingIndex: marketData.index,
        value: parseFloat(marketData.last),
        timestamp: marketData.tradeDate, // Correct field from your JSON
      });
    } else {
      console.warn('NIFTY 50 data not found in marketState.');
    }
  } catch (error) {
    console.error('Failed to fetch live data:', error);
  }
};

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleDownloadCSV = async () => {
    try {
      // Use the filter URL if provided, otherwise use the default endpoint
      const downloadUrl = filterUrl || 'http://localhost:8000/call/optionschain/5';
      
      console.log('Downloading CSV from:', downloadUrl); // Debug log
      
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Failed to fetch filtered data');
      
      let fullData = await response.json();
      
      // Handle different response structures (same as DataTable)
      if (fullData && typeof fullData === 'object' && fullData.data) {
        fullData = fullData.data;
      }
      
      // Ensure we have an array
      if (!Array.isArray(fullData) || fullData.length === 0) {
        console.warn('No data available for download.');
        alert('No data available for download with the current filters.');
        return;
      }

      const csvContent = [
        Object.keys(fullData[0]).join(','), // Header row
        ...fullData.map(row =>
          Object.values(row).map(val => `"${(val ?? '').toString().replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'filtered_options_data.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error downloading CSV. Please try again.');
    }
  };

  return (
    <>
      <div className={`action-bar ${isBestView ? 'best-view-only' : ''}`}>
        <div className="left-section">
          <div className='underlying-index'>{data.underlyingIndex}:</div> 
          <div className='index-value'>{data.value.toFixed(2)}</div>
          <span className='as-on'>As on {data.timestamp}</span>
          <button className="icon-btn" onClick={fetchLiveData} title="Refresh NIFTY data">
            <FaSyncAlt />
          </button>
        </div>

        <div className="right-section">
          <button className="terms-btn" onClick={() => setShowTermsModal(true)}>
            <FaGavel /> Terms
          </button>
          <button className="bestview-btn" onClick={onToggleBestView}>
            <FiMaximize /> {isBestView ? 'Exit Best View' : 'Best View'}
          </button>
          <button className="download-btn" onClick={handleDownloadCSV}>
            <FaFileCsv /> Download CSV
          </button>
          <button className="toggle-view-btn" onClick={onToggleView}>
            {viewMode === 'table' ? 'Chart View' : 'Table View'}
          </button>
        </div>
      </div>

      <Modal show={showTermsModal} onHide={() => setShowTermsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms of Use</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please read the terms carefully before using this application.</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionBar;