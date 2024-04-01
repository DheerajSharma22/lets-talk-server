const userRoutes = require("express").Router();
const { searchUsers, updateProfile, updateProfilePic, getUserStatus } = require("../controllers/User");
const { auth } = require("../middlewares/auth");

userRoutes.get("/search/:search", auth, searchUsers);
userRoutes.put("/updateProfile", auth, updateProfile);
userRoutes.put("/updateProfilePic", auth, updateProfilePic);
userRoutes.get("/getUserStatus", auth, getUserStatus);

module.exports = userRoutes;