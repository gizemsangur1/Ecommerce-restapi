const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Ürün eklenemedi", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Ürünler getirilemedi", error: error.message });
  }
};
