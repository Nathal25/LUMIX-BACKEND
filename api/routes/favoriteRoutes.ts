import express from "express";
import FavoriteController from "../controllers/FavoriteController";
import authenticateToken from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @route POST /favorites
 * @description Adds a movie to a user's list of favorites.
 * @body {string} userId - ID of the user who adds the favorite.
 * @body {string} movieId - ID of the movie to be added.
 * @returns {Object} 201 - The created favorite object with its references.
 * @returns {Error} 400 - Invalid data or duplicate favorite.
 * @returns {Error} 500 - Internal server error.
 * @access Public
 */
router.post("/", (req, res) => FavoriteController.create(req, res));

/**
 * @route GET /favorites/user/:id
 * @description Retrieves all favorite movies for a specific user.
 * @param {string} id - ID of the user.
 * @returns {Array<Movie>} 200 - List of movies marked as favorites.
 * @returns {Error} 404 - No favorites found for the specified user.
 * @returns {Error} 500 - Internal server error.
 * @access Public
 */
router.get("/user/:id", (req, res) => FavoriteController.getByUser(req, res));

/**
 * @route DELETE /favorites/movie/:id
 * @description Removes a movie from a user's list of favorites.
 * @param {string} id - ID of the movie to remove from favorites.
 * @returns {Object} 200 - Confirmation message or details of the deleted favorite.
 * @returns {Error} 404 - Favorite not found.
 * @returns {Error} 500 - Internal server error.
 * @access Public
 */
router.delete("/movie/:id", (req, res) => FavoriteController.delete(req, res));


/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;