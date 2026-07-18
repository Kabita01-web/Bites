// frontend/src/pages/dashboard/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../../services/api";
import { Trash2, Shield, User, UserCog, Search, RefreshCw } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users || []);
      setFilteredUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term),
    );
    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        await fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "moderator":
        return <UserCog className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="p-2 text-gray-500 hover:text-primary transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                User
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Role
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Joined
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{user.email}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <p className="text-gray-500 text-center py-4">No users found</p>
      )}
    </div>
  );
};

export default UserManagement;
