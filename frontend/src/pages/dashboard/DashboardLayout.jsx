import { useState, useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UtensilsCrossed,
  CalendarCheck,
  CreditCard,
  Package,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "moderator"],
  },
  {
    label: "Orders",
    path: "/dashboard/orders",
    icon: Package,
    roles: ["admin", "moderator"],
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: Users,
    roles: ["admin", "moderator"],
  },
  {
    label: "Menu Items",
    path: "/dashboard/menu-items",
    icon: UtensilsCrossed,
    roles: ["admin", "moderator"],
  },
  {
    label: "Reservations",
    path: "/dashboard/reservations",
    icon: CalendarCheck,
    roles: ["admin"],
  },
  {
    label: "Payments",
    path: "/dashboard/payments",
    icon: CreditCard,
    roles: ["admin"],
  },
  {
    label: "System Stats",
    path: "/dashboard/stats",
    icon: BarChart3,
    roles: ["admin"],
  },
];
const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-100 shrink-0">
          <div className="p-1.5 rounded-lg bg-primary">
            <UtensilsCrossed className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-gray-900">Bites</span>
          <span className="ml-auto text-[10px] uppercase tracking-widest text-gray-400 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
            {user?.role}
          </span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              {filteredNav.find((n) => isActive(n.path))?.label || "Dashboard"}
            </h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.username}
              </span>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User size={15} />
                    My Profile
                  </Link>
                  <hr className="border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
