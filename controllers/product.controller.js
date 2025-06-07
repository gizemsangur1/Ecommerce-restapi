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
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Ürün eklenemedi", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Ürünler alınamadı", error: error.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ürün güncellenemedi", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.json({ message: "Ürün silindi" });
  } catch (error) {
    res.status(500).json({ message: "Ürün silinemedi", error: error.message });
  }
};

exports.getFilteredProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    else if (sort === "price_desc") sortOption.price = -1;
    else if (sort === "newest") sortOption.createdAt = -1;

    const products = await Product.find(filter).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Ürünler alınamadı", error: error.message });
  }
};

exports.uploadProductImages = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı." });

    const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);
    product.image = [...product.image, ...imagePaths];

    await product.save();

    res.json({ message: "Görseller yüklendi", images: product.image });
  } catch (error) {
    res.status(500).json({ message: "Görseller yüklenemedi", error: error.message });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const top = parseInt(req.query.limit) || 10;

    const products = await Product.find()
      .sort({ sold: -1 }) 
      .limit(top);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "En çok satan ürünler alınamadı", error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId }).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Kategoriye göre ürünler alınamadı", error: error.message });
  }
};
