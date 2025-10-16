import mongoose, {Document, Schema, Model} from "mongoose";

/**
 * Interface that describes the "pure" properties of the user.
 * Does not include the methods/properties that Mongoose adds in Document.
*/
export interface IUser {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    resetPasswordToken?: string | null;
    resetPasswordExpires?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Interface that represents a User document in Mongoose.
 * Combines IUser with the properties of Document (like _id, save, etc.).
*/
export interface IUserDocument extends IUser, Document {}

/**
 * @typedef {Object} User
 * @property {string} firstName - User's first name. **Required.**
 * @property {string} lastName - User's last name. **Required.**
 * @property {number} age - User's age. Must be at least 13. **Required.**
 * @property {string} email - User's email. Must be unique. **Required.**
 * @property {string} password - User's password. 
 * Must be at least 8 characters long, contain at least one uppercase letter, 
 * one number, and one special character. **Required.**
 * @property {string|null} resetPasswordToken - Token for password reset functionality. Defaults to `null`.
 * @property {Date|null} resetPasswordExpires - Expiration date for the reset token. Defaults to `null`.
 * @property {Date} createdAt - Date when the user document was created (added by `timestamps`).
 * @property {Date} updatedAt - Date when the user document was last updated (added by `timestamps`).
*/
/**
 * Mongoose schema for the `User` model.
 * 
 * Defines validation rules, default values, and constraints for user data.
*/
const UserSchema: Schema<IUserDocument> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        age: { type: Number, min: 13, required: true },
        email: { type: String, required: true, unique: true},
        password: { type: String, minlength: 8, required: true, 
            match: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/ },
            // (?=.*[A-Z]) At least one uppercase letter 
            // (?=.*\d) At least one number
            // (?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]) At least one special character
            // [A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,} At least 8 characters long
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
    },
    { 
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

/**
 * Mongoose model for 'User'.
 * The generic type <IUserDocument> helps TypeScript infer types in queries.
*/
const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", UserSchema);

export default User;