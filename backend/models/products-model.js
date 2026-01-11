// Validación en MOngoose
// Este schema define la estructura de cada vehículo dentro de MongoDB

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

//Campos relevantes:
//description: default:"" si no se especifica por defecto queda vacio
//imageURL: default:"" si no se especifica por defecto queda vacio
//mileage: kilometraje por defecto es 0 y es 0 el minimo


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
