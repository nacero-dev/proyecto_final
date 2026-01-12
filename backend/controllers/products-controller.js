const Product = require("../models/products-model");

// Consultas a MongoDB con Mongoose
// Los routers llaman a estas funciones y ellas responden en JSON.

// Obtener todos los vehiculos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener vehiculos" });
  }
};

// Crear un producto nuevo
//el control de permisos (solo admin) se hace en el router antes de llegar aquí.

const createProduct = async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body); // req.body contiene los campos del vehiculo enviados desde el frontend (name, price, stock, etc.)

    const productoGuardado = await nuevoProducto.save(); //se guarda en MongoDB. Mongo le asigna un _id y Mongoose devuelve el documento ya guardado.
    res.status(201).json(productoGuardado); //Devuelve al frontend el vehiculo recién creado y el status 201 (Created).
  } catch (error) {
    res.status(400).json({ error: "Error al crear vehiculo" });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id); //se obtiene un vehiculo en particular por medio de la busqueda de su id
    if (!producto) {
      return res.status(404).json({ error: "Vehiculo no encontrado" }); // si no encuentra el id del vehiculo buscado entrega NOT FOUND
    }
    res.json(producto); // se muestra el vehiculo solicitado al usuario
  } catch (error) {
    res.status(400).json({ error: "Error al obtener vehiculo" });
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
    // req.params.id intenta actualizar un vehiculo existente en MongoDB usando su id,
    // req.body es el JSON enviado desde el frontend con los campos editados, indicando a MONGO que datos debe de cambiar 
    // new true devuelve el documento actualizado
    // runValidators: true se establece que se apliquen las reglas del schema en las actualizaciones, (catch de numeros negativos y datos erroneos)

    if (!productoActualizado) {
      return res.status(404).json({ error: "Vehiculo no encontrado" }); //en caso de no encontrar documento del id en Mongo
    }

    res.json(productoActualizado); //devuelve el documento actualizado al frontend mostrando sus datos
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar vehiculo" });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const productoEliminado = await Product.findByIdAndDelete(req.params.id); //busca el id del vehiculo y lo elimina

    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" }); //no encuentra vehiculo para eliminacion
    }

    res.json({ mensaje: "Producto eliminado correctamente" });  // confirmacion de eliminacion
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar producto" });
  }
};


// Endpoint de filtrado /products/filter que recibe parámetros por query string (q, minPrice, maxPrice, minStock) y usa operadores MongoDB $regex, $gte, $lte para obtener productos específicos

const filterProducts = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, minStock } = req.query; //query strings

    const filter = {};

    if (q) {
      filter.name = { $regex: q, $options: "i" };  // busqueda de coincidencia por palabras, "i" insensitive búsqueda sin distinguir mayúsculas/minúsculas.
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); //busqueda de coinicidencia mayores a un numero
      if (maxPrice) filter.price.$lte = Number(maxPrice);//busqueda de coinicidencia menores a un numero
    }

    if (minStock) {
      filter.stock = { $gte: Number(minStock) }; // busqueda de inventario minimo de un modelo de vehiculo particular
    }

    const products = await Product.find(filter); // resultado del filtro
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al filtrar productos" });
  }
};


module.exports = { getProducts, createProduct, getProductById, updateProduct, deleteProduct, filterProducts };
