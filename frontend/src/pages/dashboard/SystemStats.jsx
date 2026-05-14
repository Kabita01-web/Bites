import { useState, useEffect } from "react";
import {
  Users,
  Shield,
  UserCog,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getSystemStats } from "../../services/api";

const SystemStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSystemStats();
        setStats(data);
      } catch {
        setError("Could not load system stats. Ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
          <p className="text-amber-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      label: "Total Admins",
      value: stats?.totalAdmins ?? "—",
      icon: Shield,
      color: "bg-purple-600",
    },
    {
      label: "Total Moderators",
      value: stats?.totalModerators ?? "—",
      icon: UserCog,
      color: "bg-amber-600",
    },
    {
      label: "Regular Users",
      value: stats?.totalRegularUsers ?? "—",
      icon: Users,
      color: "bg-green-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">
          System Statistics
        </h2>
        <p className="text-gray-500 mt-1">
          Overview of platform user distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {stats?.createdAt && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            Platform data as of{" "}
            {new Date(stats.createdAt).toLocaleString("en-US", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default SystemStats;
