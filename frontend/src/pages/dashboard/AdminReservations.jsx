import { useState, useEffect, useMemo } from "react";
import {
  CalendarCheck,
  Clock,
  Users as UsersIcon,
  Search,
  Loader2,
  AlertCircle,
  X,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";
import {
  getAllReservationsAdmin,
  updateReservationStatusAdmin,
} from "../../services/api";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Hourglass,
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    ring: "focus:ring-amber-400",
    card: "bg-amber-50 border-amber-200",
    text: "text-amber-600",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
    ring: "focus:ring-green-400",
    card: "bg-green-50 border-green-200",
    text: "text-green-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    ring: "focus:ring-red-400",
    card: "bg-red-50 border-red-200",
    text: "text-red-600",
  },
};

const StatCard = ({ icon, label, value, color }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <IconComponent size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
};

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getAllReservationsAdmin();
      setReservations(Array.isArray(data) ? data : data?.reservations || []);
    } catch (err) {
      console.error(err);
      setError(
        "Could not load reservations. Ensure the backend server is running.",
      );
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    setError("");
    try {
      await updateReservationStatusAdmin(id, newStatus);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update reservation status.");
    } finally {
      setActionLoading(null);
    }
  };

  const counts = useMemo(() => {
    const base = {
      total: reservations.length,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    };
    reservations.forEach((r) => {
      const s = r.status || "pending";
      if (base[s] !== undefined) base[s] += 1;
    });
    return base;
  }, [reservations]);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        !search ||
        r.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || r.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, filterStatus]);

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
          Manage Reservations
        </h2>
        <p className="text-gray-500 mt-1">
          Review and update the status of all booking requests.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CalendarCheck}
          label="Total"
          value={counts.total}
          color="bg-blue-600"
        />
        <StatCard
          icon={Hourglass}
          label="Pending"
          value={counts.pending}
          color="bg-amber-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Confirmed"
          value={counts.confirmed}
          color="bg-green-600"
        />
        <StatCard
          icon={XCircle}
          label="Cancelled"
          value={counts.cancelled}
          color="bg-red-600"
        />
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-72"
          />
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1">
          {["all", "pending", "confirmed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                filterStatus === s
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Occasion
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((r) => {
                  const status = r.status || "pending";
                  const cfg = statusConfig[status];
                  return (
                    <tr
                      key={r._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
                            {r.user?.username?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {r.user?.username || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {r.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-600">
                          {r.date
                            ? new Date(r.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-600">
                          {r.time || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <UsersIcon size={13} className="text-gray-400" />
                          {r.guests ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-600 capitalize">
                          {r.occasion && r.occasion !== "none"
                            ? r.occasion
                            : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {actionLoading === r._id && (
                            <Loader2
                              size={12}
                              className="animate-spin text-gray-400"
                            />
                          )}
                          <select
                            value={status}
                            onChange={(e) =>
                              handleStatusChange(r._id, e.target.value)
                            }
                            disabled={actionLoading === r._id}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.badge} focus:outline-none focus:ring-2 ${cfg.ring} cursor-pointer`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-gray-400 text-sm"
                  >
                    {search || filterStatus !== "all"
                      ? "No reservations match your filters."
                      : "No reservations found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length > 0 ? (
          filtered.map((r) => {
            const status = r.status || "pending";
            const cfg = statusConfig[status];
            return (
              <div
                key={r._id}
                className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 shrink-0">
                    {r.user?.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {r.user?.username || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {r.user?.email}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}
                  >
                    <cfg.icon size={11} />
                    {cfg.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                      <CalendarDays size={11} /> Date
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {r.date
                        ? new Date(r.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                      <Clock size={11} /> Time
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {r.time || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                      <UsersIcon size={11} /> Guests
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {r.guests ?? "—"}
                    </p>
                  </div>
                </div>
                {r.occasion && r.occasion !== "none" && (
                  <p className="text-xs text-gray-500 capitalize">
                    <span className="font-medium">Occasion:</span> {r.occasion}
                  </p>
                )}
                <div className="pt-2 border-t border-gray-50">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-medium block mb-1.5">
                    Update Status
                  </label>
                  <div className="flex items-center gap-1.5">
                    {actionLoading === r._id && (
                      <Loader2
                        size={12}
                        className="animate-spin text-gray-400"
                      />
                    )}
                    <select
                      value={status}
                      onChange={(e) =>
                        handleStatusChange(r._id, e.target.value)
                      }
                      disabled={actionLoading === r._id}
                      className={`flex-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${cfg.badge} focus:outline-none focus:ring-2 ${cfg.ring} cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-12 text-center text-gray-400 text-sm">
            {search || filterStatus !== "all"
              ? "No reservations match your filters."
              : "No reservations found."}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
