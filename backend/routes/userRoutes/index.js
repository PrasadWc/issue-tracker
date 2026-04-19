const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.put("/:id/soft", userController.softDeleteUser);
router.delete("/:id/hard", userController.hardDeleteUser);

module.exports = router;
