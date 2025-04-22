const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const validate = require("../../middlewares/validate");
const { createUserSchema, updateUserSchema } = require("../../validators/userValidator");

router.post("/register-user", validate(createUserSchema), userController.createUser);
router.get("/user/get-by-id/:userId", userController.getUserById);
router.get("/user/get-by-email/:email", userController.getUserByEmail);
router.get("/users", userController.getAllUsers);
router.put("/user/:userId", validate(updateUserSchema), userController.updateUser);
router.delete("/user/:userId", userController.deleteUser);

module.exports = router;

