const express = require("express");
const connectDB = require("./config/database");
const app = express();
const dns = require("dns");
const User = require("./model/user");
const bcrypt = require("bcrypt");
const { signUpValidate } = require("./utils/validate");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());

app.post("/signUp", async (req, res) => {
  try {
    //validate with util function
    signUpValidate(req);
    const { firstName, lastName, email, password } = req.body;
    //password encrypt using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("user saved successfully!");
  } catch (err) {
    res.status(400).send("not able to signUp " + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong!" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong!" + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    const UPDATE_ALLOWED = [
      "firstName",
      "lastName",
      "photoUrl",
      "password",
      "about",
      "skill",
    ];
    const isAllowed = Object.keys(req.body).every((k) =>
      UPDATE_ALLOWED.includes(k),
    );
    console.log(isAllowed);
    if (!isAllowed) {
      throw new Error("Update not allowed for certain fields");
    }
    if (req.body.skill.length > 10) {
      throw new Error("Skill must be less than or equal to 10");
    }
    const userId = req.params.userId;
    const data = req.body;
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User updated sucessfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted sucessfully");
  } catch (err) {
    res.status(400).send("Something went wrong!" + err.message);
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
    console.error("Database cannot be connected!!" + err.message);
  });
