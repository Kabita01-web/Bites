import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { protect, authorize, ROLES } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected profile route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Dashboard routes with role-based access
router.get("/dashboard/user", protect, authorize(ROLES.USER), (req, res) => {
  res.status(200).json({
    message: "User Dashboard",
    role: "user",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
    features: ["View profile", "Edit settings", "Browse content"],
  });
});

router.get(
  "/dashboard/moderator",
  protect,
  authorize(ROLES.MODERATOR, ROLES.ADMIN),
  (req, res) => {
    res.status(200).json({
      message: "Moderator Dashboard",
      role: req.user.role,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      features: [
        "Manage content",
        "Review reports",
        "User management (limited)",
      ],
    });
  },
);

router.get("/dashboard/admin", protect, authorize(ROLES.ADMIN), (req, res) => {
  res.status(200).json({
    message: "Admin Dashboard",
    role: "admin",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
    features: [
      "Full system control",
      "Manage all users",
      "System settings",
      "Analytics",
    ],
  });
});

// Single dashboard endpoint that redirects based on role
router.get("/dashboard", protect, (req, res) => {
  const { role } = req.user;

  const dashboards = {
    [ROLES.ADMIN]: {
      redirectTo: "/api/dashboard/admin",
      dashboard: "Admin Control Panel",
      permissions: ["Full access", "User management", "System configuration"],
    },
    [ROLES.MODERATOR]: {
      redirectTo: "/api/dashboard/moderator",
      dashboard: "Moderator Control Panel",
      permissions: ["Content moderation", "Report handling", "User monitoring"],
    },
    [ROLES.USER]: {
      redirectTo: "/api/dashboard/user",
      dashboard: "User Dashboard",
      permissions: [
        "Profile management",
        "Content viewing",
        "Basic interactions",
      ],
    },
  };

  const userDashboard = dashboards[role] || dashboards[ROLES.USER];

  res.status(200).json({
    role: role,
    dashboard: userDashboard.dashboard,
    permissions: userDashboard.permissions,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

export default router;
