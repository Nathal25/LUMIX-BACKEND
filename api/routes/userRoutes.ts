import express from "express";
import UserController from "../controllers/UserController";
import User from "../models/User";
const router = express.Router();

/**
 * @route POST /users
 * @description Create a new user.
 * @body {string} first name - The name of the user.
 * @body {string} last name - The last name of the user.
 * @body {number} age - The age of the user.
 * @body {string} email - The mail of the user.
 * @body {string} password - The password of the user.
 * @body {string} confirmPassword - The password of the user to confirm.
 * @returns 201 with the id of the created user.
 * @access Public
 */
router.post("/", (req, res) => UserController.create(req, res));


/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;