import { useState, useEffect, useContext } from "react";
import { Users, UserCheck, Loader2 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { getAllUsers } from "../../services/api";

const ModeratorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data.users || data || []);
      } catch {
        setError("Unable to load data. Ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const totalUsers = users.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">
          Welcome, {user?.username}
        </h2>
        <p className="text-gray-500 mt-1">Moderator Dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-600">
            <Users size={22} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Total Users
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {totalUsers}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-600">
            <UserCheck size={22} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Your Role
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5 capitalize">
              Moderator
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Registered Users ({totalUsers})
          </h3>
        </div>
        {users.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {users.map((u) => (
              <div
                key={u._id || u.id}
                className="flex items-center gap-3 px-5 py-3"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                  {u.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {u.username}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <span
                  className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                    u.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : u.role === "moderator"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.role || "user"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            {error ? "Unable to load users" : "No users found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;
