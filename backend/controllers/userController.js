import User from "../models/User.js"; // Changed from 'user' to 'User'

export const updateUser = async (req, res) => {
  try {
    // Get userid from params (matches route :userid)
    const { userid } = req.params;
    const { username, email } = req.body;

    console.log("Update attempt - User ID:", userid);
    console.log("Update data:", { username, email });
    console.log("Authenticated user:", req.user?._id);

    // Check authorization FIRST
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (req.user._id.toString() !== userid) {
      return res.status(403).json({
        message: "You can only update your own profile",
        yourId: req.user._id.toString(),
        attemptedId: userid,
      });
    }

    // Find user - use a different variable name
    const userToUpdate = await User.findById(userid);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for existing user with same email or username
    if (username || email) {
      const searchCriteria = {
        $and: [{ _id: { $ne: userid } }, { $or: [] }],
      };

      if (username) searchCriteria.$and[1].$or.push({ username });
      if (email) searchCriteria.$and[1].$or.push({ email });

      const existingUser = await User.findOne(searchCriteria);

      if (existingUser) {
        if (existingUser.username === username) {
          return res.status(400).json({ message: "Username already in use" });
        }
        if (existingUser.email === email) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }
    }

    // Prepare update data (only include fields that are provided)
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userid, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
