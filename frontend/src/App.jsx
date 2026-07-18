import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router, // ✅ Router is here - this is fine
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
// Update these imports
import Home from "./pages/customer/Home";
import Menu from "./pages/customer/Menu";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EditProfile from "./pages/user/Profile.jsx";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ModeratorDashboard from "./pages/dashboard/ModeratorDashboard";
import UserManagement from "./pages/dashboard/UserManagement";
import SystemStats from "./pages/dashboard/SystemStats";
import MenuItemManagement from "./pages/dashboard/MenuItemManagement";
import AdminReservations from "./pages/dashboard/AdminReservations";
import OrderBoard from "./pages/dashboard/OrderBoard";
import { AuthContext } from "./context/AuthContext.jsx";
import MenuDetails from "./pages/customer/MenuDetails";
import CartPage from "./pages/customer/CartPage";
import Checkout from "./pages/customer/Checkout";
import PaymentSuccess from "./pages/customer/PaymentSucess.jsx";
import PaymentFailure from "./pages/customer/PaymentFailure";
import PaymentStatus from "./pages/customer/PaymentStatus";
import About from "./pages/info/About";
import Contact from "./pages/info/Contact";
import Reservation from "./pages/info/Reservation";
import Profile from "./pages/user/Profile";

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
              <Route
                path="reservations"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminReservations />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="OrderBoard" element={<OrderBoard />} />
            <Route path="/cartpage" element={<CartPage />} />
            <Route
              path="*"
              element={
                <h1 className="text-center mt-20 text-3xl">
                  404 - Page Not Found
                </h1>
              }
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
