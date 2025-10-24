import { Request, Response } from "express";
import ReviewDAO from "../dao/ReviewDAO";

/**
 * Controller in charge of managing movie reviews.
 * 
 * This controller provides the following functionalities:
 * - Creation of new reviews.
 * - Retrieval of reviews by movie or user.
 * - Calculation of average ratings.
 * - Update and deletion of existing reviews.
 */
class ReviewController {
  /**
   * Creates a new review for a movie.
   * 
   * @route POST /api/reviews
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * 
   * @bodyParam {string} userId - user ID of the reviewer.
   * @bodyParam {string} movieId - ID of the movie (e.g., from Pexels).
   * @bodyParam {string} comment - Text of the review.
   * @bodyParam {number} rating - User rating (e.g., 4.5).
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Prevents a user from reviewing the same movie multiple times.
   * - Returns the created review if the operation is successful.
   * - Possible responses:
   *   - 201: Review created successfully.
   *   - 400: Missing required fields.
   *   - 409: A review for this movie by the same user already exists.
   *   - 500: Internal server error.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { userId, movieId, comment, rating } = req.body;

      if (!userId || !movieId || !comment || rating == null) {
        res.status(400).json({ message: "Faltan campos obligatorios" });
        return;
      }

      const existingReview = await ReviewDAO.findByUserAndMovie(userId, movieId);
      if (existingReview) {
        res.status(409).json({ message: "Ya has reseñado esta película" });
        return;
      }

      const review = await ReviewDAO.create(req.body);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Gets all reviews for a specific movie.
   * 
   * @route GET /api/reviews/movie/:movieId
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * 
   * @paramParam {string} movieId - ID of the movie to query.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Returns an array of all reviews for the specified movie.
   * - Possible responses:
   *   - 200: Reviews found.
   *   - 404: No reviews for the specified movie.
   *   - 500: Internal server error.
   */
  async getByMovie(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const reviews = await ReviewDAO.getByMovieId(movieId);

      if (!reviews || reviews.length === 0) {
        res.status(404).json({ message: "No hay reseñas para esta película" });
        return;
      }

      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Gets all reviews created by a user.
   * 
   * @route GET /api/reviews/user/:userId
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * 
   * @paramParam {string} userId - ID of the user whose reviews are to be retrieved.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Returns all reviews made by a specific user.
   * - Possible responses:
   *   - 200: Reviews found.
   *   - 404: User has not made any reviews.
   *   - 500: Internal server error.
   */
  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const reviews = await ReviewDAO.getByUserId(userId);

      if (!reviews || reviews.length === 0) {
        res.status(404).json({ message: "Este usuario no ha hecho reseñas" });
        return;
      }

      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Gets the average rating of a movie.
   * 
   * @route GET /api/reviews/movie/:movieId/average
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * 
   * @paramParam {string} movieId - ID of the movie.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Calculates the average of all ratings (`rating`) for a movie.
   * - Possible responses:
   *   - 200: Average calculated successfully.
   *   - 500: Internal server error.
   */
  async getAverageRating(req: Request, res: Response): Promise<void> {
    try {
      const { movieId } = req.params;
      const average = await ReviewDAO.getAverageRating(movieId);
      res.status(200).json({ movieId, average });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Updates an existing review by a user for a specific movie.
   * 
   * @route PUT /api/reviews
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * 
   * @bodyParam {string} userId - ID of the user who made the review.
   * @bodyParam {string} movieId - ID of the reviewed movie.
   * @bodyParam {string} [comment] - New comment (optional).
   * @bodyParam {number} [rating] - New rating (optional).
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Allows modifying an existing review based on the user and the movie.
   * - Possible responses:
   *   - 200: Review updated successfully.
   *   - 404: Review not found.
   *   - 500: Internal server error.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { userId, movieId } = req.body;
      const review = await ReviewDAO.updateByUserAndMovie(userId, movieId, req.body);

      if (!review) {
        res.status(404).json({ message: "No se encontró la reseña" });
        return;
      }

      res.status(200).json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Deletes a specific review by its ID.
   * 
   * @route DELETE /api/reviews/:id
   * @param {Request} req - HTTP request object.
   * @param {Response} res - HTTP response object.
   * 
   * @paramParam {string} id - ID of the review to delete.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Deletes a review by its ID.
   * - Possible responses:
   *   - 200: Review deleted successfully.
   *   - 500: Internal server error.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ReviewDAO.delete(id);
      res.status(200).json({ message: "Reseña eliminada correctamente" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new ReviewController();
