import mongoose from "mongoose";

const { Schema } = mongoose;

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: {
      type: String,
      enum: ["food", "beverage", "dessert", "side"],
    },
    isAvailable: { type: Boolean, default: true },
    preparationTime: { type: Number }, // in minutes
    tags: [String], // ["vegan", "spicy", "gluten-free"]
    ingredients: { type: String, trim: true },
    menu: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
  },
  { timestamps: true },
);

export default mongoose.model("MenuItem", menuItemSchema);
