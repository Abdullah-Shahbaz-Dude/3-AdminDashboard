import LogoutButton from "./LogoutButton";
import UsersList from "./UsersList";
import "../css/Dashboard.css";

const Dashboard = () => (
  <div className="dashboard-container">
    <LogoutButton />
    <UsersList />
  </div>
);

export default Dashboard;
