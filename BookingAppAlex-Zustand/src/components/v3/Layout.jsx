import Sidebar from "./Sidebar";
import "../css/Layout.css";

const Layout = ({ children }) => (
  <div className="layout-container">
    <Sidebar />
    <main className="layout-content">{children}</main>
  </div>
);

export default Layout;
