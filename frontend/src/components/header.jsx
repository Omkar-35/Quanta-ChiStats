import React, { useEffect, useState } from 'react';
import '../styles/header.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [niftyData, setNiftyData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const mockNiftyData = {
      lastPrice: 22496.20,
      change: -83.00,
      pChange: -0.37,
    };

    setNiftyData(mockNiftyData);

    const interval = setInterval(() => {
      const randomChange = (Math.random() * 100 - 50).toFixed(2);
      const lastPrice = 22496.2 + parseFloat(randomChange);
      const pChange = ((randomChange / 22496.2) * 100).toFixed(2);
      setNiftyData({
        lastPrice,
        change: parseFloat(randomChange),
        pChange,
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString();
  const formatDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="header d-flex justify-content-between align-items-center p-3">
      {/* Left: Chistats Logo */}
      <div className="left-logo d-flex align-items-center gap-2">
        <img
          src="/chistats.png"
          alt="Chistats Logo"
          style={{ height: '40px', width: 'auto' }}
        />
      </div>

      {/* Center: Quanta Logo */}
      <div className="center-logo">
        <img
          src="/quanta.png"
          alt="Quanta Logo"
          style={{ height: '70px', width: 'auto' }}
        />
      </div>

      <div className="d-flex align-items-center gap-3">
        <img src="logo_nifty50.png" alt="NSE Logo" className="nse-logo" />
        <div className="vr" />
        {/* ...NSE data and datetime... */}

        {/* NSE Data */}
        {niftyData && (
          <div className="nifty-data d-flex flex-column align-items-end">
            <span className="last-price fw-semibold">
              {niftyData.lastPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={niftyData.change > 0 ? 'text-success' : 'text-danger'}
            >
              {niftyData.change > 0 ? '+' : ''}
              {niftyData.change.toFixed(2)} ({niftyData.pChange}%)
            </span>
          </div>
        )}

        {/* Vertical Line */}
        <div className="vr"></div>

        {/* Date & Time */}
        <div className="datetime text-end">
          <div className="date">{formatDate(currentTime)}</div>
          <div className="time">{formatTime(currentTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
