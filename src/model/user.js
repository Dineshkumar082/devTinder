const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 30,
  },
  age: {
    type: Number,
    min: 18,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 10,
    required: true,
  },
  about: {
    type: String,
    maxLength: 100,
    default: "This is the default message for about",
  },
  gender: {
    type: String,
    lowercase: true,
    required: true,
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender is not valide!");
      }
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://www.shutterstock.com/image-vector/default-avatar-social-media-display-600nw-2632690107.jpg",
  },
  skill: {
    type: [String],
  },
});

module.exports = mongoose.model("User", userSchema);
