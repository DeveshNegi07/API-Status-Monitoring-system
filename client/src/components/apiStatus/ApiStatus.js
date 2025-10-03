import "./apiStatusStyle.css";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { BsTriangleFill } from "react-icons/bs";

const ApiStatus = ({ apiName, statuses, apiNo }) => {
  const statusColor = (statusCode) => {
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

  const visualIndicator = () => {
    const lastStatus = statuses[statuses.length - 1];

    if (lastStatus >= 200 && lastStatus < 300) {
      return <FaCheckCircle style={{ color: "#00ae00", fontSize: "20px" }} />;
    } else if (lastStatus >= 400 && lastStatus < 600) {
      return <ImCross style={{ color: "#ff0000", fontSize: "15px" }} />;
    } else if (lastStatus >= 300 && lastStatus < 400) {
      return <FaCircle style={{ color: "#eb7900", fontSize: "20px" }} />;
    } else if (lastStatus >= 100 && lastStatus < 200) {
      return <BsTriangleFill style={{ color: "#aeab00", fontSize: "20px" }} />;
    }
  };

  return (
    <div className="api-status">
      <div>
        <h4>
          {apiNo} Api-{apiName}
        </h4>
        {visualIndicator()}
      </div>
      <div>
        {statuses &&
          statuses.map((statusCode, index) => (
            <div
              key={index}
              className="status-box"
              style={{ backgroundColor: statusColor(statusCode) }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default ApiStatus;
