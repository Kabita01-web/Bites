import mongoose from "mongoose";

const { Schema } = mongoose;

const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Menu name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "drinks", "specials"],
      required: [true, "Category is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    availableFrom: {
      type: String, // "08:00"
    },
    availableTo: {
      type: String, // "11:00"
    },
    availableDays: {
      type: [String],
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
