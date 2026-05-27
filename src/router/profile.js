const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middleware/auth");
const {
  validateProfileEdit,
  validateUpdatePassword,
} = require("../utils/validate");
const bcrypt = require("bcrypt");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    //validate the req.body
    validateProfileEdit(req);
    //map all the fields need to change
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((fields) => {
      loggedInUser[fields] = req.body[fields];
    });
    await loggedInUser.save();
    // await updateUser.save();
    res.json({
      message: `${loggedInUser.firstName} profile is updated sucessfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    //validateUpdatePassword
    validateUpdatePassword(req);
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    user.password = passwordHash;
    await user.save();
    await res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("password updated sucessfully!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
