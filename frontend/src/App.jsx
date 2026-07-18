import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
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
import PaymentTransactions from "./pages/dashboard/PaymentTransactions";
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

// Everything that needs access to useLocation() lives here,
// since useLocation() only works INSIDE <Router>.
function AppShell() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Hide the public Navbar/Footer on any /dashboard/* route,
  // since DashboardLayout renders its own header + sidebar.
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboardRoute && <Navbar />}

      <main className="grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:id" element={<MenuDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />
          <Route path="/payment/status" element={<PaymentStatus />} />

          {/* Protected User Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "moderator"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <ModeratorDashboard />
                )
              }
            />
            <Route path="orders" element={<OrderBoard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="menu-items" element={<MenuItemManagement />} />
            <Route path="reservations" element={<AdminReservations />} />
            <Route path="payments" element={<PaymentTransactions />} />
            <Route path="stats" element={<SystemStats />} />
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <h1 className="text-center mt-20 text-3xl">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>

      {!isDashboardRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell />
    </Router>
  );
}

export default App;
