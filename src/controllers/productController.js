const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// @desc    Obtener todos los productos
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// @desc    Obtener producto por ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      originalPrice, 
      image, 
      category, 
      stock 
    } = req.body;

    // Verificar si la categoría existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Categoría no válida' });
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      image,
      category,
      stock,
      inStock: stock > 0
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear producto', error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Actualizar campos
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.originalPrice = req.body.originalPrice || product.originalPrice;
    product.image = req.body.image || product.image;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;
    product.inStock = req.body.stock > 0;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.deleteOne();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};