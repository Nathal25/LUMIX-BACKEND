import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Base interface representing a review.
 */
export interface IReview {
  userId: mongoose.Types.ObjectId; // reference to the user making the review
  movieId: string;                 // ID of the movie (from Pexels or Cloudinary)
  comment: string;                 // user's comment
  rating: number;                  // rating from 1 to 5
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface representing a Mongoose review document.
 */
export interface IReviewDocument extends IReview, Document {}

/**
 * @typedef {Object} Review
 * @property {ObjectId} userId - ID of the user who made the review (reference to the "User" collection).
 * @property {string} movieId - ID of the movie (from Pexels or Cloudinary).
 * @property {string} comment - User's comment. **Required.**
 * @property {number} rating - Rating from 1 to 5. **Required.**
 * @property {Date} createdAt - Creation date.
 * @property {Date} updatedAt - Last update date.
 */
const ReviewSchema: Schema<IReviewDocument> = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    movieId: { 
      type: String, 
      required: true 
    },
    comment: { 
      type: String, 
      required: true,
      trim: true, 
      minlength: [3, "El comentario es muy corto."],
      maxlength: [1000, "El comentario es demasiado largo."]
    },
    rating: { 
      type: Number, 
      required: true, 
      min: [1, "La calificación mínima es 1"],
      max: [5, "La calificación máxima es 5"]
    },
  },
  { timestamps: true }
);

/**
 * Index to ensure a user can only review a specific movie once.
 */
ReviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

/**
 * Mongoose model for 'Review'.
 */
const Review: Model<IReviewDocument> = mongoose.model<IReviewDocument>("Review", ReviewSchema);

export default Review;
