import express from "express";
import MovieController from "../controllers/MovieController";
import authenticateToken from "../middlewares/authMiddleware";

const router = express.Router();

/**
 * @route GET /movies
 * @description Retrieves all movies stored in the database.
 * @returns {Array<Movie>} 200 - List of all stored movies.
 * @returns {Error} 500 - Internal server error.
 * @access Public
 */
router.get("/", (req, res) => MovieController.getAllMovies(req, res));

/**
 * @route GET /movies/:id
 * @description Retrieves a specific movie by its unique ID.
 * @param {string} id - Unique ID of the movie.
 * @returns {Movie} 200 - The requested movie.
 * @returns {Error} 404 - Movie not found.
 * @returns {Error} 500 - Internal server error.
 * @access Public
 */
router.get("/:id", (req, res) => MovieController.getMovieById(req, res));

/**
 * @route GET /movies/popular/:pages
 * @description Fetches popular movies from Pexels and saves them to the database if they don’t already exist.
 * @param {number} pages - Number of pages to retrieve from Pexels.
 * @returns {Array<Movie>} 200 - List of popular movies retrieved from Pexels.
 * @returns {Error} 500 - Error connecting to Pexels API or database.
 * @access Public
 */
router.get("/popular/:pages", (req, res) => MovieController.getPopularMovies(req, res));

/**
 * @route POST /movies/search
 * @description Searches for movies by category in the database or via the Pexels API.
 * @body {string} category - Search term or category (e.g., "nature", "sports").
 * @returns {Array<Movie>} 200 - List of matching movies.
 * @returns {Error} 404 - No results found for the given category.
 * @returns {Error} 500 - Internal server error.
 * @access Public
 */
router.post("/search", (req, res) => MovieController.searchMoviesByCategory(req, res));

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;