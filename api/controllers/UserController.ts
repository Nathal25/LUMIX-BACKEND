import UserDAO from "../dao/UserDAO";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

//const jwt = require("jsonwebtoken");
//const nodemailer = require("nodemailer");
//const TaskDAO = require("../dao/TaskDAO");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * UserController
 *
 * Handles user-specific logic such as registration, login, and password validation for the Taskly backend.
 * Extends GlobalController to inherit generic CRUD operations, but overrides and adds methods for user management.
 *
 * @class UserController
 * @extends GlobalController
 */
class UserController {
    /**
     * Creates a new user with validation and password hashing.
     * Checks for password match, email uniqueness, and hashes the password before saving.
     *
     * @async
     * @override
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<void>}
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            // Validate password and confirmPassword match
            const passwordError = this.passwordValidation(req);
            if (passwordError) {
                res.status(400).json({ message: passwordError });
                return;
            }

            // Check if the email already exists
            const existingUser = await UserDAO.readByEmail(req.body.email);
            if (existingUser) {
                res.status(409).json({ message: "Correo electrónico ya en uso" });
                return;
            }

            await this.hashPassword(req);

            // Call the create method directly from UserDAO
            const newUser = await UserDAO.create(req.body);
            res.status(201).json({ id: newUser._id });
        } catch (error) {
            // Show detailed error only in development
            if (process.env.NODE_ENV === "development") {
                console.error(error);
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Additional validation for password
    /**
     * Validates the password and confirmPassword fields in the request.
     * Ensures they match and meet complexity requirements.
     *
     * @param {Object} req - Express request object
     * @returns {string|null} Error message if invalid, otherwise null
     */
    passwordValidation(req: Request): string | null {
        if (req.body.password != req.body.confirmPassword) {
            return "La contraseña y la confirmación de contraseña no coinciden";
        }

        // Remove confirmPassword before saving
        delete req.body.confirmPassword;

        // Validate the password syntaxis
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
        if (!passwordRegex.test(req.body.password)) {
            return "La contraseña no es válida";
        }

        return null;
    }

    async hashPassword(req: Request): Promise<void> {
        const newPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = newPassword;
        return;
    }
}

// Export an instance of the UserController
export default new UserController();