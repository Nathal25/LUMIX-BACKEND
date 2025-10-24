import GlobalDao from "./GlobalDAO";
import Review, { IReviewDocument } from "../models/Review";
import { FilterQuery } from "mongoose";

/**
 * ReviewDAO
 *
 * Data Access Object for reviews.
 * Handles CRUD operations and provides methods
 * for fetching reviews by movie or user.
 *
 * @class ReviewDAO
 * @extends GlobalDAO
 */
class ReviewDAO extends GlobalDao<IReviewDocument> {
  constructor() {
    super(Review);
  }

  /**
   * Gets all reviews for a specific movie.
   * @param movieId - Movie ID (from Pexels or Cloudinary)
   * @returns List of reviews for that movie
   */
  async getByMovieId(movieId: string): Promise<IReviewDocument[]> {
    try {
      return await Review.find({ movieId }).populate("userId", "firstName lastName email");
    } catch (error: any) {
      throw new Error(`Error getting reviews for movie ${movieId}: ${error.message}`);
    }
  }

  /**
   * Gets all reviews written by a specific user.
   * @param userId - The user's ObjectId
   * @returns List of reviews by that user
   */
  async getByUserId(userId: string): Promise<IReviewDocument[]> {
    try {
      return await Review.find({ userId });
    } catch (error: any) {
      throw new Error(`Error getting reviews for user ${userId}: ${error.message}`);
    }
  }

  /**
   * Gets the average rating for a movie.
   * @param movieId - Movie ID
   * @returns Average rating (number) or 0 if none
   */
  async getAverageRating(movieId: string): Promise<number> {
    try {
      const result = await Review.aggregate([
        { $match: { movieId } },
        { $group: { _id: "$movieId", average: { $avg: "$rating" } } }
      ]);

      return result.length > 0 ? result[0].average : 0;
    } catch (error: any) {
      throw new Error(`Error calculating average rating: ${error.message}`);
    }
  }


  /**
   * Searches for a review by userId and movieId.
   */
  async findByUserAndMovie(userId: string, movieId: string): Promise<IReviewDocument | null> {
    return Review.findOne({ userId, movieId });
  }


  async updateByUserAndMovie(userId: string, movieId: string, data: Partial<IReviewDocument>): Promise<IReviewDocument | null> {
    try {
        const updatedReview = await Review.findOneAndUpdate(
        { userId, movieId },
        data,
        { new: true }
        );
        return updatedReview;
    } catch (error: any) {
        throw new Error(`Error updating review: ${error.message}`);
    }
    }


}

export default new ReviewDAO();
