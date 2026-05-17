const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Dineshkumar:Closethedoor@cluster0.chc4kzt.mongodb.net/DevTinder",
  );
};

module.exports = connectDB;
