import React, { useState } from 'react';
import './App.css';
import Header from './components/header';
import Filters from './components/filters';
import ActionBar from './components/actionbar';
import DataTable from './components/datatable';
import DataChart from './components/datachart';

function App() {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'
  const [isBestView, setIsBestView] = useState(false); // Best view toggle

  // Toggle between table and chart view
  const toggleView = () => {
    setViewMode((prev) => (prev === 'table' ? 'chart' : 'table'));
  };

  // Toggle best view mode
  const toggleBestView = () => {
    setIsBestView((prev) => !prev);
  };

  return (
    <div className={`App ${isBestView ? 'best-view' : ''}`}>
      {/* Hide Header and Filters if Best View is active */}
      {!isBestView && <Header />}
      {!isBestView && <Filters />}

      <ActionBar
        viewMode={viewMode}
        onToggleView={toggleView}
        isBestView={isBestView}
        onToggleBestView={toggleBestView}
      />

      {/* Render chart or table based on viewMode */}
      {viewMode === 'table' ? <DataTable /> : <DataChart />}
    </div>
  );
}

export default App;
