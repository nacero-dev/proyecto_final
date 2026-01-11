/*“Validación básica en Mongoose: required + tipos + mínimos (price/stock >= 0)”.*/

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }, 
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "" },
    mileage: { type: Number, default: 0, min: 0 },
    itvDate: { type: Date, default: null },
    lastServiceDate: { type: Date, default: null },
  },
  { timestamps: true }
);


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
