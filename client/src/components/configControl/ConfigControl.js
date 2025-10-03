import React, { useContext, useState } from "react";
import "./configControlStyle.css";
import axios from "axios";
import { statusData } from "../../context/StatusContext";

const ConfigControl = ({ controls, getAllConfig, closeControls }) => {
  const url = process.env.REACT_APP_API_URL;
  const [control, setControl] = useState(controls);
  const { getApiNames } = useContext(statusData);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "checkbox") {
      setControl({ ...control, [name]: checked });
    } else if (name === "requestNumber" || name === "rate") {
      setControl({
        ...control,
        limit: {
          ...control.limit,
          [name]: name === "requestNumber" ? Number(value) : value,
        },
      });
    } else if (name === "startTime" || name === "endTime") {
      setControl({
        ...control,
        onOffTime: {
          ...control.onOffTime,
          [name]: value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (controls !== control) {
      try {
        await axios.patch(`${url}/api/config/${control._id}`, control);
        getAllConfig();
        getApiNames();
        closeControls();
      } catch (error) {
        console.error("Error updating config:", error.message);
      }
    } else {
      closeControls();
    }
  };

  return (
    <form className="controls" onSubmit={handleSubmit}>
      <h2>Controls</h2>
      <div className="control">
        <label className="control-label">API</label>
        <label className="switch">
          <input
            type="checkbox"
            name="apiDisabled"
            checked={control.apiDisabled}
            onChange={handleChange}
          />
          <span className="slider"></span>
        </label>
      </div>
      <div className="control">
        <label className="control-label">Tracer</label>
        <label className="switch">
          <input
            type="checkbox"
            name="tracerDisabled"
            checked={control.tracerDisabled}
            onChange={handleChange}
          />
          <span className="slider"></span>
        </label>
      </div>
      <div className="control">
        <label className="control-label">Limit</label>
        <label className="switch">
          <input
            type="checkbox"
            name="requestLimitEnabled"
            checked={control.requestLimitEnabled}
            onChange={handleChange}
          />
          <span className="slider"></span>
        </label>
      </div>
      {control.requestLimitEnabled && (
        <div className="limit-field">
          <span>
            <p>Number of Request:</p>
            <input
              type="number"
              name="requestNumber"
              value={control.limit.requestNumber || "0"}
              onChange={handleChange}
            />
          </span>
          <span>
            <p>Rate:</p>
            <select
              name="rate"
              value={control.limit.rate}
              onChange={handleChange}
            >
              <option value="sec">Sec</option>
              <option value="hour">Hour</option>
              <option value="day">Day</option>
            </select>
          </span>
        </div>
      )}
      <div className="control">
        <label className="control-label">Schedule On/Off</label>
        <label className="switch">
          <input
            type="checkbox"
            name="scheduleOnOffEnabled"
            checked={control.scheduleOnOffEnabled}
            onChange={handleChange}
          />
          <span className="slider"></span>
        </label>
      </div>
      {control.scheduleOnOffEnabled && (
        <div className="schedule-field">
          <span>
            <p>Start Time:</p>
            <input
              type="time"
              name="startTime"
              value={control.onOffTime.startTime}
              onChange={handleChange}
            />
          </span>
          <span>
            <p>End Time </p>
            <input
              type="time"
              name="endTime"
              value={control.onOffTime.endTime}
              onChange={handleChange}
            />
          </span>
        </div>
      )}
      <button type="submit">Save</button>
    </form>
  );
};

export default ConfigControl;
