const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLenght: 2,
      maxLenght: 20,
    },
    lastName: {
      type: String,
      trim: true,
      minLenght: 2,
      maxLenght: 20,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      email: true,
    },
    password: {
      type: String,
      required: true,
      minLenght: 8,
    },
    age: {
      type: Number,
      min: 18,
      max: 130,
      minLength: 1,
      maxLenght: 3,
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
