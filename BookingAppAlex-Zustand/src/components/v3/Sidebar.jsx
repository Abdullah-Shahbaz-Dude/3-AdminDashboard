import { NavLink } from "react-router-dom";
import "../css/sidebar.css";
// import '../css/';

const options = [
  { id: 1, route: "/dashboard", title: "Dashboard" },
  { id: 2, route: "/workbooks", title: "Workbooks" },
  { id: 3, route: "/new-user", title: "Create new user and Assign" },
];

const Sidebar = () => (
  <div className="sidebar">
    <ul>
      {options.map((option) => (
        <li key={option.id}>
          <NavLink
            to={option.route}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {option.title}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

export default Sidebar;
