import React, { useContext, useEffect } from "react";
import "./tracerStyle.css";
import NavSideBar from "../../components/navbar/NavSideBar";
import { IoCalendarNumberSharp } from "react-icons/io5";
import { tracerData } from "../../context/TracerContext";

const Tracer = () => {
  const { tracerLog, getTracerLog } = useContext(tracerData);

  useEffect(() => {
    getTracerLog();
  }, []);

  const responseColor = (statusCode) => {
    if (statusCode >= 200 && statusCode < 300) {
      return "#00ae00";
    } else if (statusCode >= 400 && statusCode < 600) {
      return "#ff0000";
    } else if (statusCode >= 300 && statusCode < 400) {
      return "#eb7900";
    } else if (statusCode >= 100 && statusCode < 200) {
      return "#aeab00";
    }
  };

  return (
    <div className="app-container">
      <NavSideBar />
      <section className="tracer-section">
        <h2>API Trace Logs</h2>
        {tracerLog &&
          tracerLog.map((data, index) => (
            <div className="logs" key={index}>
              <div className="log-date">
                <span>
                  <IoCalendarNumberSharp />
                </span>
                <h4>{data.date}</h4>
              </div>
              <div className="log-data">
                {data.logData.map((log) => (
                  <div key={log._id}>
                    <p>
                      [{log._id}] {log.httpMethod} {log.endpoint}
                    </p>
                    <p
                      className="response"
                      style={{ color: responseColor(log.statusCode) }}
                    >
                      Response: {log.statusCode} ({log.responseTime}ms)
                    </p>
                    {log.consoleData.length > 0 && (
                      <>
                        {" "}
                        <h4>Console Data:</h4>
                        <div className="console-data">
                          {log.consoleData.map((consoleData, i) => (
                            <div key={i}>
                              <p>
                                <span>console type :</span>{" "}
                                {consoleData.consoleType}
                              </p>
                              <p>
                                <span>message:</span> {consoleData.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </section>
    </div>
  );
};

export default Tracer;
