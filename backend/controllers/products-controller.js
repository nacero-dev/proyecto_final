const Product = require("../models/products-model");

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

// Crear un producto nuevo
const createProduct = async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(400).json({ error: "Error al crear producto" });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: "Error al obtener producto" });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar producto" });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const productoEliminado = await Product.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar producto" });
  }
};


// *@ Consulta de productos () “Se añadió un endpoint de filtrado /products/filter que recibe parámetros por query string (q, minPrice, maxPrice, minStock) y usa operadores MongoDB $regex, $gte, $lte para obtener productos específicos.”

const filterProducts = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, minStock } = req.query;

    const filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" };  // "i" insensitive búsqueda sin distinguir mayúsculas/minúsculas.
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minStock) {
      filter.stock = { $gte: Number(minStock) };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar productos" });
  }
};


module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts, 
};
