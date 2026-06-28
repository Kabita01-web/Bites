import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router, // ✅ Router is here - this is fine
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Reservation from "./pages/Reservation";
import MenuDetails from "./pages/MenuDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";
import EditProfile from "./pages/auth/EditProfile";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ModeratorDashboard from "./pages/dashboard/ModeratorDashboard";
import UserManagement from "./pages/dashboard/UserManagement";
import SystemStats from "./pages/dashboard/SystemStats";
import MenuItemManagement from "./pages/dashboard/MenuItemmanagement";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const DashboardHome = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "moderator":
      return <ModeratorDashboard />;
  }
};

function App() {
  return (
    <Router>
      {" "}
      {/* ✅ Only ONE Router in the entire app */}
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/menu/:id" element={<MenuDetails />} />{" "}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route
                path="users"
                element={
                  <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="stats"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <SystemStats />
                  </ProtectedRoute>
                }
              />
              <Route
                path="menu-items"
                element={
                  <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                    <MenuItemManagement />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
