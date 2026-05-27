const validator = require("validator");
const signUpValidate = (req) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    throw new Error("Sorry buddy! Not a correct format for email");
  }
};

const validateProfileEdit = (req) => {
  const ALLOWED_EDIT = [
    "firstName",
    "lastName",
    "about",
    "photoUrl",
    "skill",
    "age",
    "gender",
  ];
  const isValidToEdit = Object.keys(req.body).every((fields) =>
    ALLOWED_EDIT.includes(fields),
  );
  if (!isValidToEdit) throw new Error("Some fields are not allowed to Edit");
};

const validateUpdatePassword = (req) => {
  const { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("Set the strong password buddy!");
  }
};
module.exports = {
  signUpValidate,
  validateProfileEdit,
  validateUpdatePassword,
};
