const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const validate = require("../../middlewares/validate");
const { createUserSchema, updateUserSchema } = require("../../validators/userValidator");
const { validateUserId, validateEmail } = require("../../validators/validateSearchById");

router.post("/register-user", validate(createUserSchema), userController.createUser);
router.get("/user/get-by-id/:userId", validateUserId, userController.getUserById);
router.get("/user/get-by-email/:email", validateEmail, userController.getUserByEmail);
router.get("/users", userController.getAllUsers);
router.put("/user/:userId", validate(updateUserSchema), validateUserId, userController.updateUser);
router.delete("/user/:userId", validateUserId, userController.deleteUser);

module.exports = router;

