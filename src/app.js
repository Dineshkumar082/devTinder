const express = require("express");
const connectDB = require("./config/database");
const app = express();
const dns = require("dns");
const User = require("./model/user");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);

    res.send(user);
  } catch (err) {
    console.log(err);

    res.status(400).send("Something went wrong!", err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.send("Something went wrong!", err);
  }
});
app.post("/signUp", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
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
