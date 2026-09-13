const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },

    // Wallets
    virtualBalance: { type: Number, default: 100000 }, // ₹1,00,000 demo money
    realBalance: { type: Number, default: 0 },

    // KYC
    kycVerified: { type: Boolean, default: false },
    kycDocuments: { type: Map, of: String },

    // Linked bank accounts
    bankAccounts: [
      {
        bankName: String,
        accountNo: String,
        ifscCode: String,
        isPrimary: { type: Boolean, default: false },
        linkedAt: { type: Date, default: Date.now },
      },
    ],

    // Notifications prefs
    notifications: {
      priceAlerts: { type: Boolean, default: true },
      sipReminders: { type: Boolean, default: true },
      news: { type: Boolean, default: true },
    },

    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
