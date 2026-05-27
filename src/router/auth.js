const express = require("express");
const authRouter = express.Router();
const { signUpValidate } = require("../utils/validate");
const User = require("../model/user");
const bcrypt = require("bcrypt");

authRouter.post("/signUp", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid user credentials!");
    }
    const isPasswordValid = await user.validatePassword(password);
    console.log(isPasswordValid);

    if (isPasswordValid) {
      //create the jwt token
      const jwtToken = await user.getJWT();
      console.log(jwtToken);

      //create the cookie and pass the token
      const cookie = res.cookie("token", jwtToken, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("logged in sucessful!");
    } else {
      throw new Error("Invalid user credentials! ");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    await res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout sucessfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = authRouter;
