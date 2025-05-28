import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  TrendingUp,
  BarChart3,
  Activity,
  Volume2,
  Settings,
  Download,
  RotateCcw,
  Calendar,
  Clock,
  Maximize2,
  Code,
  AlertCircle,
  Loader2,
} from "lucide-react";

const chartTypes = [
  { key: "candlestick", label: "Candles", icon: TrendingUp },
  { key: "line", label: "Line", icon: Activity },
  { key: "bars", label: "Bars", icon: BarChart3 },
  { key: "area", label: "Area", icon: Activity },
  { key: "baseline", label: "Baseline", icon: Activity },
  { key: "histogram", label: "Histogram", icon: Volume2 },
];

// Professional TradingView-style chart component
const TradingChart = ({ data, type, width, height, showGrid }) => {
  const theme = "light";
  const canvasRef = useRef(null);
  const [crosshair, setCrosshair] = useState({
    x: null,
    y: null,
    visible: false,
  });
  const [hoveredData, setHoveredData] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    // Theme colors
    const colors =
      theme === "dark"
        ? {
            background: "#1a1a1a",
            grid: "#2a2a2a",
            text: "#ffffff",
            border: "#333333",
            bullish: "#26a69a",
            bearish: "#ef5350",
            line: "#2196F3",
            volume: "#4a90e2",
          }
        : {
            background: "#ffffff",
            grid: "#e0e0e0",
            text: "#333333",
            border: "#cccccc",
            bullish: "#26a69a",
            bearish: "#ef5350",
            line: "#2196F3",
            volume: "#4a90e2",
          };

    // Clear canvas with background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Chart margins
    const margin = { top: 30, right: 80, bottom: 60, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Get data range
    let minValue, maxValue;

    if (type === "candlestick" || type === "bars") {
      const highs = data.map((d) =>
        parseFloat(d.high || d.High || d.close || d.LTP || 0)
      );
      const lows = data.map((d) =>
        parseFloat(d.low || d.Low || d.close || d.LTP || 0)
      );
      minValue = Math.min(...lows);
      maxValue = Math.max(...highs);
    } else if (type === "histogram") {
      const volumes = data.map((d) => parseFloat(d.volume || d.Volume || 0));
      minValue = 0;
      maxValue = Math.max(...volumes);
    } else {
      const values = data.map((d) =>
        parseFloat(d.close || d.LTP || d.buy_price || d.buyPrice || 0)
      );
      minValue = Math.min(...values);
      maxValue = Math.max(...values);
    }

    const valueRange = maxValue - minValue;
    const padding = valueRange * 0.05;
    minValue -= padding;
    maxValue += padding;

    // Helper functions
    const getX = (index) =>
      margin.left + (index / Math.max(1, data.length - 1)) * chartWidth;
    const getY = (value) =>
      margin.top + ((maxValue - value) / (maxValue - minValue)) * chartHeight;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;

      // Horizontal grid lines
      const gridLines = 8;
      for (let i = 0; i <= gridLines; i++) {
        const y = margin.top + (i / gridLines) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
      }

      // Vertical grid lines
      const verticalLines = Math.min(10, Math.floor(data.length / 5));
      for (let i = 0; i <= verticalLines; i++) {
        const x = margin.left + (i / verticalLines) * chartWidth;
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
      }
    }

    // Draw price scale
    ctx.fillStyle = colors.text;
    ctx.font =
      '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = "right";

    const priceSteps = 6;
    for (let i = 0; i <= priceSteps; i++) {
      const value = maxValue - (i / priceSteps) * (maxValue - minValue);
      const y = margin.top + (i / priceSteps) * chartHeight;

      // Price labels
      ctx.fillText(value.toFixed(2), width - margin.right + 10, y + 4);

      // Horizontal reference lines
      if (i > 0 && i < priceSteps) {
        ctx.strokeStyle = colors.grid;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw time scale
    ctx.textAlign = "center";
    const timeSteps = Math.min(8, data.length);
    for (let i = 0; i < timeSteps; i++) {
      const dataIndex = Math.floor((i / (timeSteps - 1)) * (data.length - 1));
      const item = data[dataIndex];
      const x = getX(dataIndex);

      if (item) {
        const timeStr = item.Time || item.time || item.Date || item.date || "";
        const displayTime = timeStr.includes(":")
          ? timeStr.split(" ")[1] || timeStr
          : timeStr;
        ctx.fillText(displayTime.substring(0, 8), x, height - 20);
      }
    }

    // Draw chart based on type
    switch (type) {
      case "candlestick":
        data.forEach((item, index) => {
          const open = parseFloat(item.open || item.Open || item.LTP || 0);
          const close = parseFloat(item.close || item.Close || item.LTP || 0);
          const high = parseFloat(
            item.high || item.High || Math.max(open, close)
          );
          const low = parseFloat(item.low || item.Low || Math.min(open, close));

          const x = getX(index);
          const openY = getY(open);
          const closeY = getY(close);
          const highY = getY(high);
          const lowY = getY(low);

          const isGreen = close >= open;
          const candleWidth = Math.max(2, (chartWidth / data.length) * 0.7);

          // Draw wick
          ctx.strokeStyle = isGreen ? colors.bullish : colors.bearish;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, highY);
          ctx.lineTo(x, lowY);
          ctx.stroke();

          // Draw body
          const bodyHeight = Math.abs(closeY - openY) || 1;
          const bodyY = Math.min(openY, closeY);

          if (isGreen) {
            ctx.strokeStyle = colors.bullish;
            ctx.lineWidth = 2;
            ctx.strokeRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
          } else {
            ctx.fillStyle = colors.bearish;
            ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
          }
        });
        break;

      case "bars":
        data.forEach((item, index) => {
          const open = parseFloat(item.open || item.Open || item.LTP || 0);
          const close = parseFloat(item.close || item.Close || item.LTP || 0);
          const high = parseFloat(
            item.high || item.High || Math.max(open, close)
          );
          const low = parseFloat(item.low || item.Low || Math.min(open, close));

          const x = getX(index);
          const openY = getY(open);
          const closeY = getY(close);
          const highY = getY(high);
          const lowY = getY(low);

          const isGreen = close >= open;
          const tickWidth = 4;

          ctx.strokeStyle = isGreen ? colors.bullish : colors.bearish;
          ctx.lineWidth = 1;

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(x, highY);
          ctx.lineTo(x, lowY);
          ctx.stroke();

          // Open tick (left)
          ctx.beginPath();
          ctx.moveTo(x - tickWidth, openY);
          ctx.lineTo(x, openY);
          ctx.stroke();

          // Close tick (right)
          ctx.beginPath();
          ctx.moveTo(x, closeY);
          ctx.lineTo(x + tickWidth, closeY);
          ctx.stroke();
        });
        break;

      case "line":
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.forEach((item, index) => {
          const value = parseFloat(
            item.close || item.LTP || item.buy_price || item.buyPrice || 0
          );
          const x = getX(index);
          const y = getY(value);
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
        break;

      case "area":
        // Area fill
        ctx.fillStyle = `${colors.line}30`;
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + chartHeight);
        data.forEach((item, index) => {
          const value = parseFloat(
            item.close || item.LTP || item.buy_price || item.buyPrice || 0
          );
          const x = getX(index);
          const y = getY(value);
          ctx.lineTo(x, y);
        });
        ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
        ctx.closePath();
        ctx.fill();

        // Area line
        ctx.strokeStyle = colors.line;
        ctx.lineWidth = 2;
        ctx.beginPath();
        data.forEach((item, index) => {
          const value = parseFloat(
            item.close || item.LTP || item.buy_price || item.buyPrice || 0
          );
          const x = getX(index);
          const y = getY(value);
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
        break;

      case "baseline":
        const baseline = (minValue + maxValue) / 2;
        const baselineY = getY(baseline);

        data.forEach((item, index) => {
          const value = parseFloat(
            item.close || item.LTP || item.buy_price || item.buyPrice || 0
          );
          const x = getX(index);
          const y = getY(value);
          const isAboveBaseline = value > baseline;

          ctx.strokeStyle = isAboveBaseline ? colors.bullish : colors.bearish;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, baselineY);
          ctx.lineTo(x, y);
          ctx.stroke();
        });

        // Baseline
        ctx.strokeStyle = colors.text + "80";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(margin.left, baselineY);
        ctx.lineTo(margin.left + chartWidth, baselineY);
        ctx.stroke();
        ctx.setLineDash([]);
        break;

      case "histogram":
        data.forEach((item, index) => {
          const volume = parseFloat(item.volume || item.Volume || 0);
          const x = getX(index);
          const barHeight = (volume / maxValue) * chartHeight;
          const barWidth = Math.max(1, (chartWidth / data.length) * 0.8);

          ctx.fillStyle = index % 2 === 0 ? colors.bullish : colors.volume;
          ctx.fillRect(
            x - barWidth / 2,
            margin.top + chartHeight - barHeight,
            barWidth,
            barHeight
          );
        });
        break;
    }

    // Draw crosshair if active
    if (crosshair.visible && crosshair.x !== null && crosshair.y !== null) {
      ctx.strokeStyle = colors.text + "80";
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crosshair.x, margin.top);
      ctx.lineTo(crosshair.x, margin.top + chartHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(margin.left, crosshair.y);
      ctx.lineTo(margin.left + chartWidth, crosshair.y);
      ctx.stroke();

      ctx.setLineDash([]);
    }
  }, [data, type, width, height, showGrid, theme, crosshair]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCrosshair({ x, y, visible: true });

    // Find closest data point
    const margin = { left: 80, right: 80 };
    const chartWidth = width - margin.left - margin.right;
    const dataIndex = Math.round(
      ((x - margin.left) / chartWidth) * (data.length - 1)
    );

    if (dataIndex >= 0 && dataIndex < data.length) {
      setHoveredData(data[dataIndex]);
    }
  };

  const handleMouseLeave = () => {
    setCrosshair({ x: null, y: null, visible: false });
    setHoveredData(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{
          background: theme === "light" ? "#1a1a1a" : "#ffffff",
          borderRadius: "8px",
          cursor: "crosshair",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Price tooltip */}
      {hoveredData && (
        <div
          className={`absolute top-4 left-4 p-3 rounded-lg shadow-lg ${
            theme === "light"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-800"
          } text-sm font-mono`}
        >
          <div>Time: {hoveredData.Time || hoveredData.time || "-"}</div>
          {(type === "candlestick" || type === "bars") && (
            <>
              <div>
                O:{" "}
                {parseFloat(hoveredData.open || hoveredData.LTP || 0).toFixed(
                  2
                )}
              </div>
              <div>
                H:{" "}
                {parseFloat(hoveredData.high || hoveredData.LTP || 0).toFixed(
                  2
                )}
              </div>
              <div>
                L:{" "}
                {parseFloat(hoveredData.low || hoveredData.LTP || 0).toFixed(2)}
              </div>
              <div>
                C:{" "}
                {parseFloat(hoveredData.close || hoveredData.LTP || 0).toFixed(
                  2
                )}
              </div>
            </>
          )}
          {type === "histogram" && (
            <div>
              Volume: {parseFloat(hoveredData.volume || 0).toLocaleString()}
            </div>
          )}
          {(type === "line" || type === "area" || type === "baseline") && (
            <div>
              Price:{" "}
              {parseFloat(
                hoveredData.close ||
                  hoveredData.LTP ||
                  hoveredData.buy_price ||
                  0
              ).toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProfessionalTradingChart = ({ filterUrl, activeFilters }) => {
  const [chartType, setChartType] = useState("candlestick");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartHeight, setChartHeight] = useState(600);
  const [showGrid, setShowGrid] = useState(true);
  const theme = "light";
  const [showCustomization, setShowCustomization] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = filterUrl || "http://localhost:8000/call/optionschain/5";
        console.log("Fetching chart data from:", url);

        const response = await axios.get(url);
        let responseData = response.data;

        if (
          responseData &&
          typeof responseData === "object" &&
          responseData.data
        ) {
          responseData = responseData.data;
        }

        if (Array.isArray(responseData)) {
          // Process data to ensure proper format
          const processedData = responseData.map((item) => ({
            ...item,
            open:
              item.open ||
              item.Open ||
              item.LTP ||
              item.buy_price ||
              item.buyPrice ||
              0,
            high:
              item.high ||
              item.High ||
              item.LTP ||
              item.buy_price ||
              item.buyPrice ||
              0,
            low:
              item.low ||
              item.Low ||
              item.LTP ||
              item.buy_price ||
              item.buyPrice ||
              0,
            close:
              item.close ||
              item.Close ||
              item.LTP ||
              item.buy_price ||
              item.buyPrice ||
              0,
            volume: item.volume || item.Volume || 0,
            time: item.Time || item.time || new Date().toLocaleTimeString(),
            date: item.Date || item.date || new Date().toLocaleDateString(),
          }));

          setData(processedData);
        } else {
          console.warn("Unexpected data format:", responseData);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);

        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            setError("No data found for the selected filters");
          } else if (status === 500) {
            setError("Server error occurred while fetching data");
          } else {
            setError(`Error ${status}: Failed to load chart data`);
          }
        } else if (error.request) {
          setError(
            "Unable to connect to the server. Please check if the backend is running."
          );
        } else {
          setError("An unexpected error occurred while loading chart data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (filterUrl !== undefined) {
      fetchData();
    }
  }, [filterUrl]);

  const getChartTitle = () => {
    const typeNames = {
      candlestick: "Candlestick Chart",
      line: "Price Line Chart",
      bars: "OHLC Bars",
      area: "Area Chart",
      baseline: "Baseline Chart",
      histogram: "Volume Histogram",
    };

    let title = typeNames[chartType] || "Chart";

    if (activeFilters) {
      const { instrument, optionType } = activeFilters;
      title = `${instrument} ${optionType} - ${title}`;
    }

    return title;
  };

  const exportData = () => {
    if (data.length === 0) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row) => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `chart_data_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${"bg-gradient-to-br from-slate-50 to-blue-50"}`}
      >
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className={`text-lg 'text-gray-600'`}>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-gray-900"
            : "bg-gradient-to-br from-slate-50 to-blue-50"
        }`}
      >
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600 mb-2">{error}</p>
          <p
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Please check your backend connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">
                {getChartTitle()}
              </h1>
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                Professional Trading Analysis
                <Clock size={16} />
                Real-time Data
              </p>
            </div>

            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Code size={18} />
              Get this chart
            </button>
          </div>

          {/* Chart Type Selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            {chartTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setChartType(type.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  chartType === type.key
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customization Panel */}
        {showCustomization && (
          <div className="mb-6 rounded-xl p-6 shadow-lg bg-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Settings size={20} />
              Chart Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Chart Height
                </label>
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
                    className="rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show Grid Lines
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Theme
                </label>
                <select
                  value={theme}
                  // onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white border-gray-300 text-gray-900"
                >
                  <option value="light">Light</option>
                </select>
              </div>

              <div>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full justify-center"
                >
                  <Download size={18} />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chart Container */}
        <div className="rounded-xl shadow-lg p-6 bg-white">
          <TradingChart
            data={data}
            type={chartType}
            width={Math.min(1200, window.innerWidth - 150)}
            height={chartHeight}
            showGrid={showGrid}
            theme="light"
          />
        </div>

        {/* Chart Statistics */}
        {data.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="rounded-lg p-4 shadow-sm bg-white">
              <h4 className="font-semibold mb-2 text-gray-800">
                Total Records
              </h4>
              <p className="text-2xl font-bold text-blue-600">{data.length}</p>
            </div>
            <div className="rounded-lg p-4 shadow-sm bg-white">
              <h4 className="font-semibold mb-2 text-gray-800">Chart Type</h4>
              <p className="text-lg capitalize text-gray-600">
                {chartType.replace("_", " ")}
              </p>
            </div>
            <div className="rounded-lg p-4 shadow-sm bg-white">
              <h4 className="font-semibold mb-2 text-gray-800">Date Range</h4>
              <p className="text-sm text-gray-600">
                {data.length > 0
                  ? `${data[0].date || data[0].Date || "N/A"} - ${
                      data[data.length - 1].date ||
                      data[data.length - 1].Date ||
                      "N/A"
                    }`
                  : "No data"}
              </p>
            </div>
            <div className="rounded-lg p-4 shadow-sm bg-white">
              <h4 className="font-semibold mb-2 text-gray-800">Price Range</h4>
              <p className="text-sm text-gray-600">
                {data.length > 0
                  ? (() => {
                      const prices = data.map((d) =>
                        parseFloat(d.close || d.LTP || d.high || 0)
                      );
                      const min = Math.min(...prices);
                      const max = Math.max(...prices);
                      return `${min.toFixed(2)} - ${max.toFixed(2)}`;
                    })()
                  : "No data"}
              </p>
            </div>
          </div>
        )}

        {/* Code Export Modal */}
        {showCustomization && (
          <div className="mt-6 rounded-xl shadow-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Code size={20} />
              Use This Chart in Your Project
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-700">
                  React Component Usage:
                </h4>
                <div className="rounded-lg p-4 font-mono text-sm overflow-x-auto bg-gray-100 text-gray-800">
                  <pre>{`<ProfessionalTradingChart 
  filterUrl="${filterUrl || "your-api-endpoint"}"
  activeFilters={{
    instrument: "${activeFilters?.instrument || "NIFTY"}",
    optionType: "${activeFilters?.optionType || "CE"}"
  }}
/>`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-gray-700">
                  API Data Format Expected:
                </h4>
                <div className="rounded-lg p-4 font-mono text-sm overflow-x-auto bg-gray-100 text-gray-800">
                  <pre>{`[
  {
    "open": 45.25,
    "high": 47.80,
    "low": 44.10,
    "close": 46.50,
    "volume": 125000,
    "Time": "09:30:00",
    "Date": "2024-01-15"
  }
]`}</pre>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`
import ProfessionalTradingChart from './ProfessionalTradingChart';

<ProfessionalTradingChart 
  filterUrl="${filterUrl || "your-api-endpoint"}"
  activeFilters={{
    instrument: "${activeFilters?.instrument || "NIFTY"}",
    optionType: "${activeFilters?.optionType || "CE"}"
  }}
/>`);
                    alert("Component code copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Copy Component Code
                </button>

                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href =
                      "data:text/javascript;charset=utf-8," +
                      encodeURIComponent(
                        document.querySelector("script").textContent
                      );
                    link.download = "ProfessionalTradingChart.jsx";
                    link.click();
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Download Full Component
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTradingChart;
