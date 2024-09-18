const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  !isAdminAuthorized ? res.send("Unauthorized request") : next();
};
const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";

  !isAdminAuthorized ? res.send("Unauthorized user request") : next();
};

module.exports = {
  adminAuth,
  userAuth,
};
