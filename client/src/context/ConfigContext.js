import axios from "axios";
import { createContext, useState } from "react";

export const configurationData = createContext();
const ConfigContext = ({ children }) => {
  const url = process.env.REACT_APP_API_URL;
  const [configData, setConfigData] = useState([]);

  const getAllConfig = async () => {
    try {
      const response = await axios.get(`${url}/api/config`);
      setConfigData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <configurationData.Provider value={{ getAllConfig, configData }}>
      {children}
    </configurationData.Provider>
  );
};

export default ConfigContext;
