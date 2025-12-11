const Product = require("../models/productsModel");

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Crear un producto nuevo
const createProduct = async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save();
    res.status(201).json({ mensaje: "Producto creado correctamente", producto: nuevoProducto });
  } catch {
    res.status(400).json({ error: "Error al crear producto" });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch {
    res.status(400).json({ error: "Error al buscar producto" });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ mensaje: "Producto actualizado correctamente", producto: productoActualizado });
  } catch {
    res.status(400).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch {
    res.status(400).json({ error: "Error al eliminar producto" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
