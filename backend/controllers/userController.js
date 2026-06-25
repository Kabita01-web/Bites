import User from "../models/User.js";

export const updateUser = async (req, res) => {
  // ... your existing function, unchanged ...
};

// GET /api/users/stats
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalModerators = await User.countDocuments({ role: "moderator" });
    const totalRegularUsers = totalUsers - totalAdmins - totalModerators;

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalModerators,
      totalRegularUsers,
      createdAt: new Date(), // optional, since SystemStats.jsx checks stats?.createdAt
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/users/role/:userid  (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userid } = req.params;
    const { role } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const validRoles = ["user", "moderator", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update role error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/users/:userid  (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (req.user._id.toString() === userid) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    const deletedUser = await User.findByIdAndDelete(userid);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
