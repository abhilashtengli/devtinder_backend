const validator = require("validator");
const User = require("../models/user");
const signupValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Invalid first name or last name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateProfileData = (req) => {
  const allowedProfileData = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "age",
    "gender",
    "photoUrl",
  ];
  user = req.body;

  const isAllowedProfileData = Object.keys(user).every((field) =>
    allowedProfileData.includes(field)
  );

  if (!isAllowedProfileData) {
    return false;
  }

  const tempUser = new User(user);
  const validationError = tempUser.validateSync({ validateModifiedOnly: true });

  if (validationError) {
    throw new Error("ERROR : " + validationError.message);
  }

  return true;
};

module.exports = { signupValidation, validateProfileData };
