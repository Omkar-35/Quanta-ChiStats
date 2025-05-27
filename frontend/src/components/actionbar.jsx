import React from 'react';
import { Modal } from 'react-bootstrap';
import '../styles/actionbar.css';
import { FaSyncAlt, FaFileCsv, FaGavel } from 'react-icons/fa';
import { FiMaximize } from 'react-icons/fi';

const ActionBar = ({ viewMode, onToggleView, isBestView, onToggleBestView }) => {
  // Initial static data
  const initialData = {
    underlyingIndex: 'NIFTY',
    value: 24813.45,
    timestamp: '21-May-2025 15:30:00 IST',
  };

  // Simulated "live" data for refresh
  const liveDataSamples = [
    { value: 24850.12, timestamp: '21-May-2025 15:31:00 IST' },
    { value: 24795.67, timestamp: '21-May-2025 15:32:00 IST' },
    { value: 24820.89, timestamp: '21-May-2025 15:33:00 IST' },
  ];

  const [data, setData] = React.useState(initialData);
  const [showTermsModal, setShowTermsModal] = React.useState(false);

  // Refresh handler
  const handleRefresh = () => {
    const randomSample = liveDataSamples[Math.floor(Math.random() * liveDataSamples.length)];
    setData((prev) => ({
      ...prev,
      value: randomSample.value,
      timestamp: randomSample.timestamp,
    }));
  };

  // Terms modal handlers
  const handleShowTerms = () => setShowTermsModal(true);
  const handleCloseTerms = () => setShowTermsModal(false);

  // CSV Download handler
  const handleDownloadCSV = () => {
    const link = document.createElement('a');
    link.href = process.env.PUBLIC_URL + '/sample-data.csv';
    link.download = 'filtered-data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="action-bar d-flex justify-content-between align-items-center p-3 border rounded shadow-sm bg-white">
        <div className="d-flex align-items-center nifty-info">
          <strong>Underlying Index : {data.underlyingIndex} {data.value.toFixed(2)}</strong>
          <span className="ms-3">As on {data.timestamp}</span>
          <button className="btn refresh-btn ms-3" onClick={handleRefresh} title="Refresh NIFTY data">
            <FaSyncAlt />
          </button>
        </div>

        <div className="d-flex align-items-center action-buttons">
          <button className="btn terms-btn me-3 d-flex align-items-center" onClick={handleShowTerms}>
            <FaGavel className="me-1" />
            Terms of Use
          </button>

          <button className="btn best-view-btn me-3 d-flex align-items-center" onClick={onToggleBestView}>
            <FiMaximize className="me-1" />
            {isBestView ? 'Exit Best View' : 'Best View'}
          </button>

          <button className="btn download-btn me-3 d-flex align-items-center" onClick={handleDownloadCSV}>
            <FaFileCsv className="me-1" />
            Download (.csv)
          </button>

          <button className="btn toggle-view-btn d-flex align-items-center" onClick={onToggleView}>
            {viewMode === 'table' ? 'Switch to Chart View' : 'Switch to Table View'}
          </button>
        </div>
      </div>

      {/* Terms of Use Modal */}
      <Modal show={showTermsModal} onHide={handleCloseTerms} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terms of Use</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            These are the terms of use of this application. Please read carefully before using.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ActionBar;
