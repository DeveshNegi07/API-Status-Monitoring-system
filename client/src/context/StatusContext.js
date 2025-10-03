import axios from "axios";
import { createContext, useState } from "react";

export const statusData = createContext();
const StatusContext = ({ children }) => {
  const url = process.env.REACT_APP_API_URL;
  const [apiNames, setApiNames] = useState([]);
  const [apiStatusList, setApiStatusList] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const getApiNames = async () => {
    try {
      const response = await axios.get(`${url}/api/config`);
      // Only keep APIs that are enabled
      const enabledApis = response.data.filter((item) => !item.apiDisabled);
      const apiNames = enabledApis.map((item) => item.apiName);
      setApiNames(apiNames);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getApiStatus = async (apiName) => {
    try {
      const response = await axios.get(
        `${url}/api/${apiName}/status?from=${dateRange.startDate}&to=${dateRange.endDate}`
      );
      const statusCodes = response.data.map((item) => item.statusCode);
      return statusCodes;
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const getApiStatusList = async () => {
    const results = await Promise.all(
      apiNames.map(async (api) => {
        const statusCodes = await getApiStatus(api);
        return { apiName: api, statusCodes };
      })
    );

    const filteredResults = results.filter(
      (item) => Array.isArray(item.statusCodes) && item.statusCodes.length > 0
    );

    setApiStatusList(filteredResults);
  };

  return (
    <statusData.Provider
      value={{
        getApiNames,
        apiStatusList,
        setDateRange,
        dateRange,
        getApiStatusList,
      }}
    >
      {children}
    </statusData.Provider>
  );
};

export default StatusContext;
