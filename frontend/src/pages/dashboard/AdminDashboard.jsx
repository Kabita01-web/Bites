import { useState, useEffect } from "react";
import { Calendar, Users, Clock, Loader2 } from "lucide-react";
import {
  getAllReservationsAdmin,
  updateReservationStatusAdmin,
} from "../../services/api"; // matches this file's import path, not the "../../api/api" I guessed earlier

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getAllReservationsAdmin();
        setReservations(data);
      } catch {
        setError(
          "Could not load reservations. Ensure the backend server is running.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReservationStatusAdmin(id, newStatus);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
      );
    } catch {
      setError("Failed to update reservation status.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">
          Reservations
        </h2>
        <p className="text-gray-500 mt-1">
          Manage upcoming and past table bookings.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">All Reservations</h3>
        </div>

        {reservations.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {reservations.map((r) => (
              <div
                key={r._id}
                className="flex items-center gap-3 px-5 py-3 flex-wrap"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                  {r.user?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-[160px]">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {r.user?.username}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {r.user?.email}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={14} />
                  {new Date(r.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14} />
                  {r.time}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={14} />
                  {r.guests}
                </div>

                <select
                  value={r.status}
                  onChange={(e) => handleStatusChange(r._id, e.target.value)}
                  className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full border-0 ${
                    statusStyles[r.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            {error ? "Unable to load reservations" : "No reservations found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
