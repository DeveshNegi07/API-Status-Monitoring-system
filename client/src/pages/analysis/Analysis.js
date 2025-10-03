import React, { useEffect, useState } from "react";
import axios from "axios";
import NavSideBar from "../../components/navbar/NavSideBar";
import "./AnalysisStyle.css";
import UpTimeGraph from "../../components/UpTimeGraph";

const Analysis = () => {
  const url = process.env.REACT_APP_API_URL;
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await axios.get(`${url}/api/stats`);
        setStatsData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    getStats();
  }, []);

  function formatIsoToCustom(isoDateString) {
    const dateObj = new Date(isoDateString);

    const optionsDate = { month: "short", day: "numeric" }; // e.g. "Apr 21"
    const optionsTime = { hour: "numeric", minute: "numeric", hour12: true }; // e.g. "11:45 PM"

    const formattedDate = dateObj.toLocaleDateString("en-US", optionsDate);
    const formattedTime = dateObj.toLocaleTimeString("en-US", optionsTime);

    return `${formattedDate}, ${formattedTime}`;
  }

  return (
    <div className="app-container">
      <NavSideBar />
      <section className="analysis-section">
        <h2>Analysis</h2>
        <div className="stats-container">
          <div className="stats-card">
            <h4>Uptime Percentage</h4>
            <div
              className="ring"
              style={{
                background: `conic-gradient(#06a089 ${
                  (Math.abs(statsData.uptimePercentage) / 100) * 360
                }deg, #1a1f37  0deg) `,
              }}
            >
              <span>{Math.round(statsData.uptimePercentage * 100) / 100}%</span>
            </div>
            <p className="end-value">
              Last downtime:{" "}
              {formatIsoToCustom(statsData.lastDowntimeTimestamp)}
            </p>
          </div>
          <div className="stats-card">
            <h4>Total Request Volume</h4>
            <p className="mid-value">{statsData.totalRequests}</p>
          </div>
          <div className="stats-card">
            <h4>Average Response Time</h4>
            <p className="mid-value">
              {Math.round(statsData.avgResponseTime)} ms
            </p>
          </div>
          <div className="stats-card">
            <h4>Error Rate</h4>
            <div
              className="ring"
              style={{
                background: `conic-gradient(#800101 ${
                  (Math.abs(statsData.errorRate) / 100) * 360
                }deg, #1a1f37 0deg) `,
              }}
            >
              <span>{Math.round(statsData.errorRate * 100) / 100}%</span>
            </div>
            <p className="end-value">
              Most common error: {statsData.mostCommonError}
            </p>
          </div>
        </div>
        <div className="graph-container">
          <h4>Uptime Percentage Over Time</h4>
          <UpTimeGraph />
        </div>
      </section>
    </div>
  );
};

export default Analysis;
