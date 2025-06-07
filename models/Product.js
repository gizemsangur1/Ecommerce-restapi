const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
   stockThreshold: {
    type: Number,
    default: 5,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: [String],
    default: ""
  },
  sold:{
    type:Number,
    default:0,
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
