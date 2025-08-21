import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/v3/ErrorBoundary";
import { ClipLoader } from "react-spinners";
import AdminLogin from "./components/v3/AdminLogin";
import ProtectedRoute from "./components/v3/ProtectedRoute";
import Dashboard from "./components/v3/Dashboard";
// import Layout from "./components/v3/Layout";
import Layout from "./components/v3/Layout";
import UserManagement from "./components/v3/UserManagement";
import WorkbookDetail from "./components/v3/WorkbookDetail";
import WorkbookViewer from "./components/v3/WorkbookViewer";
import NewUser from "./components/v3/NewUser";
import AssignWorkSheets from "./components/v3/AssignWorkSheets";
import UserLink from "./components/v3/UserLink";
import WorkBooks from "./components/v3/WorkBooks";
import UserDashboard from "./components/v3/UserDashboard";
// import NotFound from "./components/NotFound";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workbooks"
            element={
              <ProtectedRoute>
                <Layout>
                  <WorkBooks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-user"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workbook/:id"
            element={
              <ProtectedRoute>
                <WorkbookDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/user-dashboard/:token" element={<UserDashboard />} />
          <Route
            path="/user-dashboard/workbook/:token/:workbookId"
            element={<WorkbookViewer />}
          />
          <Route
            path="/new-user"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewUser />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assign-workbooks/:userId"
            element={
              <ProtectedRoute>
                <Layout>
                  <AssignWorkSheets />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-link/:userId"
            element={
              <ProtectedRoute>
                <Layout>
                  <UserLink />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
