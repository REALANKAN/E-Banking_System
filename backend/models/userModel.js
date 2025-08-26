const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true, // Ensures faster queries
      trim: true, 
      lowercase: true 
    },

    password: { 
      type: String, 
      required: true, 
      minlength: 6,
      validate: {
        validator: function (value) {
          // Modified regex to be more flexible
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value);
        },
        message: "Password must contain at least 1 uppercase letter, 1 number, and 1 special character.",
      },
    },

    accountType: { 
      type: String, 
      enum: ["customer", "admin"], 
      default: "customer" 
    },

    role: { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user-entered password with the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.generateAuthToken = function () {
  const userObj = this.toObject();
  return jwt.sign(
    { id: userObj._id, role: userObj.role },
    process.env.JWT_SECRET || "defaultsecret", // Fallback if env variable is not set
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
