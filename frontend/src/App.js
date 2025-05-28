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
  
  // New state for filters integration
  const [filterUrl, setFilterUrl] = useState(null);
  const [activeFilters, setActiveFilters] = useState(null);

  // Toggle between table and chart view
  const toggleView = () => {
    setViewMode((prev) => (prev === 'table' ? 'chart' : 'table'));
  };

  // Toggle best view mode
  const toggleBestView = () => {
    setIsBestView((prev) => !prev);
  };

  // Handle filter fetch from Filters component
  const handleFilterFetch = ({ url, filters }) => {
    console.log('Fetching from URL:', url);
    console.log('Active filters:', filters);
    
    setFilterUrl(url);
    setActiveFilters(filters);
  };

  return (
    <div className={`App ${isBestView ? 'best-view' : ''}`}>
      {/* Hide Header and Filters if Best View is active */}
      {!isBestView && <Header />}
      {!isBestView && <Filters onFetch={handleFilterFetch} />}

      <ActionBar
        viewMode={viewMode}
        onToggleView={toggleView}
        isBestView={isBestView}
        onToggleBestView={toggleBestView}
      />

      {/* Render chart or table based on viewMode */}
      {viewMode === 'table' ? (
        <DataTable 
          filterUrl={filterUrl} 
          activeFilters={activeFilters} 
        />
      ) : (
        <DataChart 
          filterUrl={filterUrl} 
          activeFilters={activeFilters} 
        />
      )}
    </div>
  );
}

export default App;