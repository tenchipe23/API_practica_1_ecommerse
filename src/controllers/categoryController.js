const Category = require('../models/categoryModel');

// @desc    Obtener todas las categorías
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

// @desc    Crear una nueva categoría
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Categoría ya existe' });
    }

    const category = new Category({
      name,
      icon
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear categoría', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory
};