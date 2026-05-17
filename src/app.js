const express = require("express");
const connectDB = require("./config/database");
const app = express();
const dns = require("dns");
const User = require("./model/user");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.post("/signUp", async (req, res) => {
  const userObj = {
    firstName: "Virat",
    lastName: "Kohli",
    email: "virat@gmail.com",
    password: "test@123",
  };
  try {
    const user = new User(userObj);
    await user.save();
    res.send("user saved successfully!");
  } catch (err) {
    res.status(400).send("not able to signUp ", err);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
