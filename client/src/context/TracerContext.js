import axios from "axios";
import { createContext, useState, useCallback } from "react";

export const tracerData = createContext();

const TracerContext = ({ children }) => {
  const url = process.env.REACT_APP_API_URL;
  const [tracerLog, setTracerLog] = useState([]);

  const formatRelativeDate = (dateString) => {
    const logDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const logDateStr = logDate.toISOString().split("T")[0];
    const todayStr = today.toISOString().split("T")[0];
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (logDateStr === todayStr) return "today";
    if (logDateStr === yesterdayStr) return "yesterday";
    return logDateStr;
  };

  const getSortOrder = (date) => {
    if (date === "today") return 0;
    if (date === "yesterday") return 1;
    return 2;
  };

  const getTracerLog = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/log`);

      const groupedLogs = response.data.reduce((acc, item) => {
        const dateKey = formatRelativeDate(item.timestamp);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      }, {});

      const formattedData = Object.entries(groupedLogs)
        .map(([date, logs]) => ({
          date,
          logData: logs,
        }))
        .sort((a, b) => {
          // First sort by priority: today, yesterday, then dates
          const orderDiff = getSortOrder(a.date) - getSortOrder(b.date);
          if (orderDiff !== 0) return orderDiff;

          // Then sort actual date strings descending
          return b.date.localeCompare(a.date);
        });

      setTracerLog(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }, [url]);

  return (
    <tracerData.Provider value={{ getTracerLog, tracerLog }}>
      {children}
    </tracerData.Provider>
  );
};

export default TracerContext;
