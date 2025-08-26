const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // Import DB connection function

// Import Routes
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
const app = express();

// **Middleware**
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json({ limit: "10mb" })); // Increase request body size limit

// **Route Debugging Middleware (Logs All Requests)**
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.url}`);
  if (req.method !== "GET") {
    console.log("Request Body:", req.body);
  }
  next();
});

// **Define API Routes**
app.use("/api/auth", authRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes); // FIXED: Separate transactions endpoint

// **Root Route**
app.get("/", (req, res) => {
  res.send("E-Banking System API is running...");
});

// **404 Not Found Middleware**
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route Not Found" });
});

// **Global Error Handling Middleware**
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  if (!res.headersSent) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// **Start Server Only After DB Connection**
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Exit process on DB connection failure
  }
};

// **Initialize Server**
startServer();
