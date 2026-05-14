import { useState, useEffect, useContext, useCallback } from "react";
import {
  Search,
  Trash2,
  Shield,
  UserCog,
  User as UserIcon,
  Loader2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/api";

const roleIcon = (role) => {
  switch (role) {
    case "admin":
      return <Shield size={14} />;
    case "moderator":
      return <UserCog size={14} />;
    default:
      return <UserIcon size={14} />;
  }
};

const roleColors = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  moderator: "bg-amber-100 text-amber-700 border-amber-200",
  user: "bg-gray-100 text-gray-600 border-gray-200",
};

const UserManagement = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const isAdmin = currentUser?.role === "admin";

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users || data || []);
    } catch {
      setError("Could not load users. Ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    setError("");
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) =>
          (u._id || u.id) === userId ? { ...u, role: newRole } : u
        )
      );
    } catch {
      setError("Failed to update user role. Check your permissions.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    setActionLoading(userId);
    setError("");
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
    } catch {
      setError("Failed to delete user. Check your permissions.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            User Management
          </h2>
          <p className="text-gray-500 mt-1">
            {isAdmin
              ? "Create, edit, and manage all users."
              : "View registered users."}
          </p>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-64"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-4">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError("")} className="ml-auto">
            <X size={14} className="text-red-400" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                {(isAdmin) && (
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const uid = u._id || u.id;
                  const isSelf = uid === (currentUser?._id || currentUser?.id);
                  const isCurrentUserAdmin = u.role === "admin";
                  const cannotModify = isSelf || (!isAdmin && isCurrentUserAdmin);

                  return (
                    <tr
                      key={uid}
                      className={`hover:bg-gray-50 transition-colors ${
                        isSelf ? "bg-primary/[0.02]" : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {u.username}
                              {isSelf && (
                                <span className="ml-2 text-[10px] text-primary font-semibold">
                                  (you)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm text-gray-600">{u.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        {isAdmin && !cannotModify ? (
                          <select
                            value={u.role || "user"}
                            onChange={(e) =>
                              handleRoleChange(uid, e.target.value)
                            }
                            disabled={actionLoading === uid}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                              roleColors[u.role || "user"]
                            } focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer`}
                          >
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${
                              roleColors[u.role || "user"]
                            }`}
                          >
                            {roleIcon(u.role)}
                            {u.role || "user"}
                          </span>
                        )}
                        {actionLoading === uid && (
                          <Loader2
                            size={12}
                            className="inline ml-1 animate-spin text-gray-400"
                          />
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm text-gray-500">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3 text-right">
                          {!cannotModify && (
                            <button
                              onClick={() => handleDelete(uid)}
                              disabled={actionLoading === uid}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete user"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    {search
                      ? "No users match your search."
                      : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
