import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import '../styles/filters.css';

const Filters = ({ onFetch }) => {
  const [instrument, setInstrument] = useState('NIFTY');
  const [optionType, setOptionType] = useState('Call');
  const [frequency, setFrequency] = useState('1min');
  const [dataType, setDataType] = useState('Price');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFetch = () => {
    onFetch({
      instrument,
      optionType,
      frequency,
      dataType,
      startDate,
      endDate,
    });
  };

  const [showModal, setShowModal] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');

  const handleReadMeOpen = () => setShowModal(true);
  const handleReadMeClose = () => setShowModal(false);

  useEffect(() => {
    fetch('/readme.txt')
      .then(res => res.text())
      .then(setReadmeContent)
      .catch(err => setReadmeContent('Failed to load Read Me.'));
  }, []);

  return (
    <>
      <Form className="p-3 border rounded shadow-sm bg-white">
        <div className="row g-3 align-items-end">
          <div className="col-md-2">
            <Form.Label>Instrument</Form.Label>
            <Form.Select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
            </Form.Select>
          </div>

          <div className="col-md-2">
            <Form.Label>Option Type</Form.Label>
            <Form.Select value={optionType} onChange={(e) => setOptionType(e.target.value)}>
              <option value="Call">Call</option>
              <option value="Put">Put</option>
            </Form.Select>
          </div>

          <div className="col-md-2">
            <Form.Label>Frequency</Form.Label>
            <Form.Select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="1min">1 min</option>
              <option value="5min">5 min</option>
            </Form.Select>
          </div>

          <div className="col-md-2">
            <Form.Label>Data Type</Form.Label>
            <Form.Select value={dataType} onChange={(e) => setDataType(e.target.value)}>
              <option value="Price">Price</option>
              <option value="OptionsChain">Options Chain</option>
            </Form.Select>
          </div>

          <div className="col-md-2">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="col-md-2">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>

          <div className="col-md-12 d-flex justify-content-end align-items-center mt-3 gap-3">
            <Button variant="primary" onClick={handleFetch}>
              Fetch
            </Button>
            <span
              onClick={handleReadMeOpen}
              className="readme-link"
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'black',
                fontSize: '0.95rem',
              }}>
              Readme...
            </span>
          </div>
        </div>
      </Form>

      <Modal show={showModal} onHide={handleReadMeClose}>
        <Modal.Header closeButton>
          <Modal.Title>Read Me</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>
          {readmeContent}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleReadMeClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Filters;
