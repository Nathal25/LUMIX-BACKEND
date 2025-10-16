import GlobalDao from "./GlobalDao";
import User, { IUserDocument } from "../models/User"; // ajusta la ruta y exporta IUserDocument en tu modelo
import { FilterQuery } from "mongoose";

/**
 * UserDAO
 *
 * Data Access Object for user-specific operations, extending GlobalDAO for generic CRUD.
 * Provides additional methods for user lookup by email.
 *
 * @class UserDAO
 * @extends GlobalDAO
 */
class UserDao extends GlobalDao<IUserDocument> {
  constructor() {
    super(User);
  }

  /**
   * Finds a user document by email address.
   * @async
   * @param emailToSearch - The email address to search for
   * @returns The found user document or null if not found
   */
  async readByEmail(emailToSearch: string): Promise<IUserDocument | null> {
    try {
      return await User.findOne({ email: emailToSearch }).exec();
    } catch (error: any) {
      throw new Error(`Error getting document by Email: ${error.message}`);
    }
  }

  /**
   * Finds a user document by email and reset token, ensuring token is not expired.
   * @async
   * @param email - The user's email
   * @param token - The reset token
   * @returns The found user document or null if not found or expired
   */
  async readByResetToken(email: string, token: string): Promise<IUserDocument | null> {
    try {
      const document = await User.findOne({
        email: email,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      }).exec();

      return document;
    } catch (error: any) {
      throw new Error(`Error getting document by reset token: ${error.message}`);
    }
  }
}

// Export an instance of the UserDAO
export default new UserDao();