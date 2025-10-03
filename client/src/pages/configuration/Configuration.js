import React, { useContext, useEffect, useState } from "react";
import NavSideBar from "../../components/navbar/NavSideBar";
import { FaEllipsisV } from "react-icons/fa";
import "./configurationStyle.css";
import ConfigControl from "../../components/configControl/ConfigControl";
import { configurationData } from "../../context/ConfigContext";

const Configuration = () => {
  const { getAllConfig, configData } = useContext(configurationData);
  const [openConfigId, setOpenConfigId] = useState(null);
  useEffect(() => {
    getAllConfig();
  }, []);

  const handleClick = (configId) => {
    setOpenConfigId(openConfigId === configId ? null : configId);
  };

  const handleClose = () => {
    setOpenConfigId(null);
  };

  return (
    <div className="app-container">
      <NavSideBar />
      <section className="config-section">
        <h2>API list</h2>
        <div>
          <div className="header">
            <h5>API Name</h5>
            <h5>Start Date</h5>
          </div>
          {configData.length > 0 &&
            configData.map((config) => (
              <div key={config._id} className="api-config">
                <p>/api/{config.apiName}</p>
                <p>{config.startDate.split("T")[0]}</p>
                <button onClick={() => handleClick(config._id)}>
                  <FaEllipsisV />
                </button>
                {openConfigId === config._id && (
                  <ConfigControl
                    controls={config}
                    getAllConfig={getAllConfig}
                    closeControls={handleClose}
                  />
                )}
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Configuration;
