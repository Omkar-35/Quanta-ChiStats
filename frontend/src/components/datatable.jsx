import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/datatable.css";

const DataTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("/dummydata.json")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dummy data:", error);
      });
  }, []);

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>OI</th>
            <th>Chng in OI</th>
            <th>Volume</th>
            <th>IV</th>
            <th>LTP</th>
            <th>Chng</th>
            <th>Bid Qty</th>
            <th>Bid</th>
            <th>Ask</th>
            <th>Ask Qty</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                <td>{row.OI.toLocaleString()}</td>
                <td className={row.chngInOI >= 0 ? "positive" : "negative"}>
                  {row.chngInOI >= 0
                    ? `+${row.chngInOI.toLocaleString()}`
                    : row.chngInOI.toLocaleString()}
                </td>
                <td>{row.volume.toLocaleString()}</td>
                <td>{row.IV}</td>
                <td>{row.LTP}</td>
                <td className={row.chng.startsWith("+") ? "positive" : "negative"}>
                  {row.chng}
                </td>
                <td>{row.bidQty.toLocaleString()}</td>
                <td>{row.bid}</td>
                <td>{row.ask}</td>
                <td>{row.askQty.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                Loading data...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
