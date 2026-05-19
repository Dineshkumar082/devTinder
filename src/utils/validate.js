const validator = require("validator");
const signUpValidate = (req) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Sorry buddy! Not a correct format for email");
  }
};

module.exports = {
  signUpValidate,
};
