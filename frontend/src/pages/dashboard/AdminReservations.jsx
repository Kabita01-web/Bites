// frontend/src/pages/dashboard/AdminReservations.jsx
import React, { useState, useEffect } from "react";
import {
  getAllReservationsAdmin,
  updateReservationStatusAdmin,
} from "../../services/api";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Users as UsersIcon,
  Search,
  RefreshCw,
} from "lucide-react";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [reservations, searchTerm, statusFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getAllReservationsAdmin();
      // Backend's getAllReservations controller does res.json(reservations) —
      // a bare array, not { reservations: [...] } — so `data` IS the array.
      const list = Array.isArray(data) ? data : [];
      setReservations(list);
      setFilteredReservations(list);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = reservations;

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      // Reservation.create() never stores top-level `name`/`phone` — the
      // schema stores a `user` ref, populated with "username email" only.
      // Search against the populated user instead.
      filtered = filtered.filter(
        (r) =>
          r.user?.username?.toLowerCase().includes(term) ||
          r.user?.email?.toLowerCase().includes(term),
      );
    }

    setFilteredReservations(filtered);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateReservationStatusAdmin(id, status);
      await fetchReservations();
    } catch (error) {
      console.error("Error updating reservation status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Reservations</h2>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={fetchReservations}
            className="p-2 text-gray-500 hover:bg-accent transition"
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
                Guest
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Date & Time
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Guests
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-white font-semibold text-sm">
                      {reservation.user?.username?.[0]?.toUpperCase() || "G"}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {reservation.user?.username || "Unknown guest"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {reservation.user?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(reservation.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {reservation.time}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    {reservation.guests} guests
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={reservation.status}
                    onChange={(e) =>
                      handleStatusUpdate(reservation._id, e.target.value)
                    }
                    className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirm</option>
                    <option value="cancelled">Cancel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReservations.length === 0 && (
        <p className="text-gray-500 text-center py-4">No reservations found</p>
      )}
    </div>
  );
};

export default AdminReservations;
