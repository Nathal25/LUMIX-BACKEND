import GlobalDao from "./GlobalDAO";
import Favorite, { IFavoriteDocument } from "../models/Favorite";
import { FilterQuery } from "mongoose";

/**
 * FavoriteDAO
 *
 * Data Access Object (DAO) for favorite-specific operations.
 * Extends `GlobalDAO` to reuse generic CRUD methods and provides
 * additional operations related to user favorites.
 *
 * @class FavoriteDAO
 * @extends GlobalDAO
 */
class FavoriteDao extends GlobalDao<IFavoriteDocument> {
    constructor() {
        super(Favorite);
    }

    /**
    * Retrieves all favorite records for a given user ID.
    * Each favorite includes populated movie details.
    *
    * @async
    * @param {string} userId - The ID of the user whose favorites are being fetched.
    * @returns {Promise<IFavoriteDocument[]>} Array of favorite documents associated with the user.
    * @throws {Error} Throws an error if the database query fails.
    */
    async getByUser(userId: string): Promise<IFavoriteDocument[]> {
        try {
            const query: FilterQuery<IFavoriteDocument> = { userId };
            const favorites = await this.model.find(query).populate("movieId").exec();
            return favorites;
        } catch (error) {
            console.error("Error in FavoriteDao.getByUser:", error);
            throw new Error("Failed to get favorites by user");
        }
    }
}

/**
 * Exports a instance of FavoriteDao for use throughout the application.
 */
export default new FavoriteDao();