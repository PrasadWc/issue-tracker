const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const { protect } = require("../../middleware/authMiddleware");

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/me", protect, userController.getMe);

// Protected routes
router.get("/", protect, userController.getUsers);
router.get("/:id", protect, userController.getUser);
router.put("/:id", protect, userController.updateUser);
router.delete("/:id", protect, userController.deleteUser);

module.exports = router;
