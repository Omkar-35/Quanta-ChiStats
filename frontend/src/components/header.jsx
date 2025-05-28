import React, { useEffect, useState } from 'react';
import '../styles/header.css';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [niftyData, setNiftyData] = useState(null);
  const [marketCap, setMarketCap] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNiftyData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/nse-market-status');
        const json = await response.json();

        const marketData = json.marketState.find(
          item => item.market === 'Capital Market' && item.index === 'NIFTY 50'
        );

        const marketCapData = json.marketcap?.marketCapinCRRupeesFormatted;

        if (marketData) {
          const lastPrice = parseFloat(marketData.last);
          const variation = parseFloat(marketData.variation);
          const percentChange = parseFloat(marketData.percentChange);

          setNiftyData({
            lastPrice,
            change: variation,
            pChange: percentChange,
          });
        }

        if (marketCapData) {
          setMarketCap(marketCapData);
        }

      } catch (error) {
        console.error('Failed to fetch NIFTY data:', error);
      }
    };

    fetchNiftyData();
    const interval = setInterval(fetchNiftyData, 5 * 60 * 1000);
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
          style={{ height: '30px', width: 'auto' }}
        />
      </div>

      {/* Center: Quanta Logo */}
      <div className="center-logo">
        <img
          src="/quanta.png"
          alt="Quanta Logo"
          style={{ height: '60px', width: 'auto' }}
        />
      </div>

      <div className="d-flex align-items-center gap-3">
        
        <div className="vr" />
        <img src="logo_nifty50.png" alt="NSE Logo" className="nse-logo" />
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
              {niftyData.change.toFixed(2)} ({niftyData.pChange.toFixed(2)}%)
            </span>
            {marketCap && (
              <span className="market-cap small text-muted">
                Mkt Cap: ₹{marketCap} Cr
              </span>
            )}
          </div>
        )}

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
