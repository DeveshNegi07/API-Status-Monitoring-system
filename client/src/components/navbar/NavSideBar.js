import { BsCreditCardFill } from "react-icons/bs";
import { FaHome, FaWrench } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import "./navBarStyle.css";

const NavSideBar = () => {
  return (
    <nav className="nav-sidebar">
      <h2>API Management</h2>
      <hr className="divider" />
      <div>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span>
            <FaHome />
          </span>
          <p>Home</p>
        </NavLink>
        <NavLink
          to="/tracer"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span>
            <BsCreditCardFill />
          </span>
          <p>Tracer</p>
        </NavLink>
        <NavLink
          to="/analysis"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span>
            <IoStatsChart />
          </span>
          <p>Analysis</p>
        </NavLink>
        <NavLink
          to="/configuration"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          <span>
            <FaWrench />
          </span>
          <p>Configuration</p>
        </NavLink>
      </div>

      <hr className="divider" />
    </nav>
  );
};

export default NavSideBar;
