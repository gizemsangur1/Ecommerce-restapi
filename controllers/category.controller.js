const Category = require("../models/Category");
const Product = require("../models/Product");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Bu kategori zaten var." });
    }

    const newCategory = await Category.create({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Kategori oluşturulamadı", error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Kategoriler alınamadı", error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Kategori bulunamadı" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Kategori getirilemedi", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const categoryId = req.params.id;

    if (!name) {
      return res.status(400).json({ message: "Kategori adı gerekli." });
    }

    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true } 
    );

    if (!updated) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Kategori güncellenemedi", error: error.message });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const productCount = await Product.countDocuments({ category: categoryId });

    if (productCount > 0) {
      return res.status(400).json({
        message: "Bu kategoriye bağlı ürünler var. Önce ürünleri silmelisiniz.",
      });
    }

    const deleted = await Category.findByIdAndDelete(categoryId);

    if (!deleted) {
      return res.status(404).json({ message: "Kategori bulunamadı." });
    }

    res.json({ message: "Kategori başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Kategori silinemedi", error: error.message });
  }
};