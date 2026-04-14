import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ProfilePage from "./pages/Users/ProfilePage";
import KanbanBoard from "./pages/Admin/KanbanBoard";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/Users/UserDashboard";
import ViewTaskDetails from "./pages/Users/ViewTaskDetails";
import MyTasks from './pages/Users/MyTasks';
import UserProvider, { UserContext } from './context/userContext';
import { ThemeProvider } from './context/themeContext';
import { NotificationProvider } from './context/notificationContext';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/kanban" element={<KanbanBoard />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route 
              path="/user/task-details/:id" 
              element={<ViewTaskDetails />} 
            />
            <Route 
              path="/user/profile" 
              element={<ProfilePage />} 
            />
          </Route>

          {/* Rutas compartidas (admin y user) */}
          <Route element={<PrivateRoute allowedRoles={["admin", "member"]} />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppContent />
          <Toaster
            toastOptions={{
              className: "",
              style: {
                fontSize: "13px",
              }
            }} 
          />
        </NotificationProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet />;

  if(!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;
};