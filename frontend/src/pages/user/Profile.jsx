import React, { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { User, Mail, Calendar, ArrowRight, Edit3 } from "lucide-react";
import { AuthContext } from "../../context/AuthContext.jsx";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: "/profile" }} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <User className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mt-4 text-3xl font-serif font-bold text-gray-900">
              My Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account information
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Username
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="p-2 bg-primary/10 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Email
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
            </div>

            {user.createdAt && (
              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Member Since
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 space-y-4">
            <Link
              to="/edit-profile"
              className="group w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-accent transition-all duration-300"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
