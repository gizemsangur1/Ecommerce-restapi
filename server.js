const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();



const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const reportRoutes = require("./routes/report.routes");
const categoryRoutes = require("./routes/category.routes");
const userRoutes = require("./routes/user.routes");




const app = express();
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000",  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, 
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => res.send("E-Ticaret API çalışıyor"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
