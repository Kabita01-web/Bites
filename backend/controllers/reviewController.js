// backend/controllers/reviewController.js
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    console.log("📝 Creating review...");
    console.log("📝 User:", req.user?._id);
    console.log("📝 Body:", req.body);

    const { orderId, menuItemId, rating, comment, images } = req.body;
    const userId = req.user._id;

    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order is delivered
    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "You can only review delivered orders",
      });
    }

    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Check if user already reviewed this item for this order
    const existingReview = await Review.findOne({
      user: userId,
      order: orderId,
      menuItem: menuItemId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this item",
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      order: orderId,
      menuItem: menuItemId,
      rating,
      comment,
      images: images || [],
      isVerified: true,
      status: "approved",
    });

    console.log("✅ Review created:", review._id);

    // Update menu item rating
    await updateMenuItemRating(menuItemId);

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("❌ Create review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

// @desc    Get reviews for a menu item
// @route   GET /api/reviews/menu/:menuItemId
// @access  Public
export const getReviewsByMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const reviews = await Review.find({
      menuItem: menuItemId,
      status: "approved",
    })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      menuItem: menuItemId,
      status: "approved",
    });

    // Calculate average rating
    const stats = await Review.aggregate([
      {
        $match: {
          menuItem: new mongoose.Types.ObjectId(menuItemId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      reviews,
      stats: {
        averageRating: stats.length > 0 ? stats[0].averageRating : 0,
        totalReviews: total,
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get reviews",
    });
  }
};

// @desc    Get my reviews
// @route   GET /api/reviews/my
// @access  Private
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("menuItem", "name price image")
      .populate("order", "total status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get my reviews error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get reviews",
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();
    await updateMenuItemRating(review.menuItem);

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    if (review.user.toString() !== req.user._id.toString() && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await review.deleteOne();
    await updateMenuItemRating(review.menuItem);

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // ✅ Check if user already marked as helpful
    if (review.helpfulBy && review.helpfulBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already marked this review as helpful",
      });
    }

    // ✅ Add user to helpfulBy array and increment count
    review.helpful += 1;
    if (!review.helpfulBy) {
      review.helpfulBy = [];
    }
    review.helpfulBy.push(userId);

    await review.save();

    res.status(200).json({
      success: true,
      helpful: review.helpful,
      message: "Marked as helpful",
    });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark as helpful",
    });
  }
};

// Helper function to update menu item rating
async function updateMenuItemRating(menuItemId) {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          menuItem: new mongoose.Types.ObjectId(menuItemId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const averageRating =
      stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const totalReviews = stats.length > 0 ? stats[0].totalReviews : 0;

    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: averageRating,
      reviewCount: totalReviews,
    });
  } catch (error) {
    console.error("Update menu item rating error:", error);
  }
}
