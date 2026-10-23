const router = require("express").Router();
const {
  getUsers,
  getCurrentUser,
  createUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth.js");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
