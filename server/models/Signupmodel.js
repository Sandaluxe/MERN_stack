const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const SignupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"]
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true 
    },
    password: {
      type: String,
      required: [true, "Please enter a password"]
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"]
    }
  },
  {
    timestamps: true 
  }
);


SignupSchema.pre('save', async function (next) {
  const user = this;

 
  if (user.password !== user.confirmPassword) {
    const err = new Error("Passwords do not match");
    return next(err);
  }


  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  // Remove confirmPassword field from the document before saving
  user.confirmPassword = undefined;
  next();
});

const Signup = mongoose.model("Signup", SignupSchema);
module.exports = Signup;
