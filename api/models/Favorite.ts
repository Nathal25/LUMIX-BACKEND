import mongoose, {Document, Schema, Model} from "mongoose";

/**
 * Interface that describes the "pure" properties of a favorite.
 * Does not include the extra properties/methods that Mongoose adds in `Document`.
 */
export interface IFavorite {
    userId: String, // ID of the user who added the favorite
    movieId: String,  // ID of the movie marked as favorite
}

/**
 * Interface that represents a Favorite document in Mongoose.
 * Combines IFavorite with the properties of `Document` (like `_id`, `save`, etc.).
 */
export interface IFavoriteDocument extends IFavorite, Document {}


/**
 * @typedef {Object} Favorite
 * @property {string} userId - ID of the user who marked the movie as favorite. **Required.**
 * @property {string} movieId - ID of the movie added to favorites. **Required.**
 * @property {Date} createdAt - Timestamp when the favorite was created (added automatically by `timestamps`).
 * @property {Date} updatedAt - Timestamp when the favorite was last updated (added automatically by `timestamps`).
 */

/**
 * Mongoose schema for the `Favorite` model.
 *
 * Defines the fields, validation rules, and automatic timestamps.
 */
const FavoriteSchema: Schema<IFavoriteDocument> = new Schema(
    {
        userId: { type: String, required: true }, // ID of the user
        movieId: { type: String, required: true }, // ID of the movie
    },
    {
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

/**
 * Mongoose model for `Favorite`.
 * 
 * The generic type `<IFavoriteDocument>` helps TypeScript infer field types in queries.
 */
const Favorite: Model<IFavoriteDocument> = mongoose.model<IFavoriteDocument>("Favorite", FavoriteSchema);

export default Favorite;