import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { BarChart3, TrendingUp, ArrowUpDown, Settings, Download, RotateCcw, Palette } from "lucide-react";

const chartTypes = [
  { key: "Price & Volume", label: "Price & Volume", icon: TrendingUp },
  { key: "Open Interest", label: "Open Interest", icon: BarChart3 },
  { key: "Bid vs Ask", label: "Bid vs Ask", icon: ArrowUpDown }
];

const colorSchemes = {
  default: { primary: "#6366f1", secondary: "#06b6d4", accent: "#10b981" },
  dark: { primary: "#1f2937", secondary: "#374151", accent: "#6b7280" },
  vibrant: { primary: "#ec4899", secondary: "#f59e0b", accent: "#8b5cf6" },
  ocean: { primary: "#0ea5e9", secondary: "#06b6d4", accent: "#14b8a6" }
};

const DataChart = () => {
  const [chartType, setChartType] = useState("Price & Volume");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCustomization, setShowCustomization] = useState(false);
  const [colorScheme, setColorScheme] = useState("default");
  const [chartHeight, setChartHeight] = useState(500);
  const [showGrid, setShowGrid] = useState(true);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Dummy data for demonstration
  const dummyData = [
    { LTP: 150, volume: 1200, OI: 5000, chngInOI: 200, bid: 149, ask: 151, bidQty: 500, askQty: 300 },
    { LTP: 155, volume: 1500, OI: 5500, chngInOI: 300, bid: 154, ask: 156, bidQty: 600, askQty: 400 },
    { LTP: 160, volume: 1800, OI: 6000, chngInOI: 150, bid: 159, ask: 161, bidQty: 700, askQty: 350 },
    { LTP: 165, volume: 2000, OI: 6200, chngInOI: -100, bid: 164, ask: 166, bidQty: 800, askQty: 450 },
    { LTP: 170, volume: 1700, OI: 5800, chngInOI: -200, bid: 169, ask: 171, bidQty: 650, askQty: 400 },
    { LTP: 175, volume: 1400, OI: 5300, chngInOI: -300, bid: 174, ask: 176, bidQty: 550, askQty: 380 },
    { LTP: 180, volume: 1100, OI: 4800, chngInOI: -250, bid: 179, ask: 181, bidQty: 450, askQty: 320 },
  ];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // For now, use dummy data
    setTimeout(() => {
      setData(dummyData);
      setLoading(false);
    }, 1000);

    // TODO: Replace with actual API call
    // fetchDataFromAPI();
  }, []);

  // Function to fetch data from FastAPI backend (commented out for now)
  /*
  const fetchDataFromAPI = async () => {
    try {
      setLoading(true);
      // TODO: Replace with your actual FastAPI endpoint
      const response = await fetch('http://your-fastapi-backend.com/api/chart-data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const apiData = await response.json();
      setData(apiData);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      // Fallback to dummy data
      setData(dummyData);
    } finally {
      setLoading(false);
    }
  };
  */

  const labels = data.map((_, i) => `${15000 + i * 50}`); // Strike prices
  const currentColors = colorSchemes[colorScheme];

  const getChartData = () => {
    switch (chartType) {
      case "Price & Volume":
        return [
          {
            x: labels,
            y: data.map((d) => d.volume),
            type: "bar",
            name: "Volume",
            yaxis: "y2",
            marker: { 
              color: currentColors.secondary,
              opacity: 0.7,
              line: { color: currentColors.secondary, width: 1 }
            },
            hovertemplate: "<b>Volume</b><br>Strike: %{x}<br>Volume: %{y:,.0f}<extra></extra>"
          },
          {
            x: labels,
            y: data.map((d) => d.LTP),
            type: "scatter",
            mode: "lines+markers",
            name: "Last Traded Price",
            marker: { 
              color: currentColors.primary, 
              size: 8,
              line: { color: '#fff', width: 2 }
            },
            line: { color: currentColors.primary, width: 3 },
            yaxis: "y1",
            hovertemplate: "<b>LTP</b><br>Strike: %{x}<br>Price: ₹%{y:,.2f}<extra></extra>"
          }
        ];

      case "Open Interest":
        return [
          {
            x: labels,
            y: data.map((d) => d.OI),
            type: "bar",
            name: "Open Interest",
            marker: { 
              color: currentColors.primary,
              opacity: 0.8,
              line: { color: currentColors.primary, width: 1 }
            },
            hovertemplate: "<b>Open Interest</b><br>Strike: %{x}<br>OI: %{y:,.0f}<extra></extra>"
          },
          {
            x: labels,
            y: data.map((d) => d.chngInOI),
            type: "bar",
            name: "Change in OI",
            marker: { 
              color: data.map(d => d.chngInOI >= 0 ? currentColors.accent : '#ef4444'),
              opacity: 0.7,
              line: { color: '#fff', width: 1 }
            },
            hovertemplate: "<b>Change in OI</b><br>Strike: %{x}<br>Change: %{y:+,.0f}<extra></extra>"
          }
        ];

      case "Bid vs Ask":
        return [
          {
            x: labels,
            y: data.map((d) => d.bid),
            type: "bar",
            name: "Bid Price",
            marker: { 
              color: currentColors.accent,
              opacity: 0.7,
              line: { color: currentColors.accent, width: 1 }
            },
            hovertemplate: "<b>Bid Price</b><br>Strike: %{x}<br>Bid: ₹%{y:,.2f}<extra></extra>"
          },
          {
            x: labels,
            y: data.map((d) => d.ask),
            type: "bar",
            name: "Ask Price",
            marker: { 
              color: '#ef4444',
              opacity: 0.7,
              line: { color: '#ef4444', width: 1 }
            },
            hovertemplate: "<b>Ask Price</b><br>Strike: %{x}<br>Ask: ₹%{y:,.2f}<extra></extra>"
          },
          {
            x: labels,
            y: data.map((d) => d.bidQty),
            type: "scatter",
            mode: "markers",
            name: "Bid Quantity",
            marker: { 
              color: currentColors.accent, 
              size: 12,
              opacity: 0.8,
              symbol: 'circle',
              line: { color: '#fff', width: 2 }
            },
            yaxis: "y2",
            hovertemplate: "<b>Bid Qty</b><br>Strike: %{x}<br>Quantity: %{y:,.0f}<extra></extra>"
          },
          {
            x: labels,
            y: data.map((d) => d.askQty),
            type: "scatter",
            mode: "markers",
            name: "Ask Quantity",
            marker: { 
              color: '#ef4444', 
              size: 12,
              opacity: 0.8,
              symbol: 'circle',
              line: { color: '#fff', width: 2 }
            },
            yaxis: "y2",
            hovertemplate: "<b>Ask Qty</b><br>Strike: %{x}<br>Quantity: %{y:,.0f}<extra></extra>"
          }
        ];

      default:
        return [];
    }
  };

  const getLayout = () => {
    return {
      title: {
        text: `<b>${chartType} Analysis</b>`,
        x: 0.5,
        font: { size: 24, color: currentColors.primary, family: 'Arial, sans-serif' }
      },
      barmode: chartType === "Open Interest" ? "group" : "overlay",
      xaxis: { 
        title: { text: "Strike Prices", font: { size: 14, color: currentColors.primary } },
        showgrid: showGrid,
        gridcolor: '#e5e7eb',
        linecolor: currentColors.primary,
        tickfont: { color: currentColors.primary }
      },
      yaxis: {
        title: { 
          text: chartType === "Price & Volume" ? "Price (₹)" : chartType === "Open Interest" ? "Open Interest / Change" : "Price (₹)",
          font: { size: 14, color: currentColors.primary }
        },
        showgrid: showGrid,
        gridcolor: '#e5e7eb',
        linecolor: currentColors.primary,
        tickfont: { color: currentColors.primary }
      },
      yaxis2: {
        title: { 
          text: chartType === "Price & Volume" ? "Volume" : "Quantity",
          font: { size: 14, color: currentColors.secondary }
        },
        overlaying: "y",
        side: "right",
        showgrid: false,
        linecolor: currentColors.secondary,
        tickfont: { color: currentColors.secondary }
      },
      legend: { 
        orientation: "h",
        x: 0.5,
        xanchor: 'center',
        y: -0.2,
        font: { color: currentColors.primary }
      },
      margin: { l: 60, r: 60, t: 80, b: 100 },
      plot_bgcolor: "#fafafa",
      paper_bgcolor: "#ffffff",
      hovermode: 'x unified',
      transition: {
        duration: animationEnabled ? 500 : 0,
        easing: 'cubic-in-out'
      }
    };
  };

  const downloadChart = () => {
    // This would trigger Plotly's download functionality
    console.log("Download chart functionality would be implemented here");
  };

  const resetView = () => {
    setColorScheme("default");
    setChartHeight(500);
    setShowGrid(true);
    setAnimationEnabled(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading chart data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Market Data Analytics</h1>
          <p className="text-gray-600">Professional trading analysis dashboard</p>
        </div>

        {/* Chart Type Selection */}
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          {chartTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.key}
                onClick={() => setChartType(type.key)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  chartType === type.key
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                <IconComponent size={20} />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap justify-between items-center bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings size={18} />
              Customize
            </button>
            <button
              onClick={downloadChart}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={resetView}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Customization Panel */}
        {showCustomization && (
          <div className="mb-6 bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette size={20} />
              Chart Customization
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Scheme</label>
                <select
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="dark">Dark</option>
                  <option value="vibrant">Vibrant</option>
                  <option value="ocean">Ocean</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chart Height</label>
                <input
                  type="range"
                  min="400"
                  max="800"
                  value={chartHeight}
                  onChange={(e) => setChartHeight(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{chartHeight}px</span>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Grid</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={animationEnabled}
                    onChange={(e) => setAnimationEnabled(e.target.checked)}
                    className="rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Animations</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Chart Container */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Plot
            data={getChartData()}
            layout={{
              ...getLayout(),
              height: chartHeight,
              autosize: true
            }}
            style={{ width: "100%", height: `${chartHeight}px` }}
            config={{
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
              responsive: true
            }}
          />
        </div>

        {/* Chart Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">Data Points</h4>
            <p className="text-2xl font-bold text-indigo-600">{data.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">Chart Type</h4>
            <p className="text-lg text-gray-600">{chartType}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-2">Color Scheme</h4>
            <p className="text-lg text-gray-600 capitalize">{colorScheme}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataChart;