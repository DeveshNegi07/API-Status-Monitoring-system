import React, { useContext, useEffect } from "react";
import NavSideBar from "../../components/navbar/NavSideBar";
import "./homeStyle.css";
import ApiStatus from "../../components/apiStatus/ApiStatus";
import { statusData } from "../../context/StatusContext";

const Home = () => {
  const {
    getApiNames,
    apiStatusList,
    setDateRange,
    dateRange,
    getApiStatusList,
  } = useContext(statusData);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };

  const handleSubmit = () => {
    getApiStatusList();
  };

  useEffect(() => {
    getApiNames();
    getApiStatusList();
  }, []);

  return (
    <div className="app-container">
      <NavSideBar />
      <section className="home-section">
        <h2>Home</h2>
        <div>
          <h4>System status</h4>
          <p>select start and end date</p>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateRangeChange}
            max={dateRange.endDate || undefined}
          />
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateRangeChange}
            min={dateRange.startDate || undefined}
          />
          <button onClick={handleSubmit}>submit</button>
        </div>
        <div className="status-container">
          {apiStatusList.length > 0 &&
            apiStatusList.map((apiData, index) => (
              <ApiStatus
                key={index}
                apiName={apiData.apiName}
                statuses={apiData.statusCodes}
                apiNo={index + 1}
              />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
