import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Interface base que define las propiedades de una reseña.
 */
export interface IReview {
  userId: mongoose.Types.ObjectId; // referencia al usuario que hace la reseña
  movieId: string;                 // ID de la película (de Pexels o Cloudinary)
  comment: string;                 // comentario del usuario
  rating: number;                  // calificación de 1 a 5
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interfaz que representa un documento de reseña en Mongoose.
 */
export interface IReviewDocument extends IReview, Document {}

/**
 * @typedef {Object} Review
 * @property {ObjectId} userId - ID del usuario que hizo la reseña (referencia a la colección "User").
 * @property {string} movieId - ID de la película (de Pexels o Cloudinary).
 * @property {string} comment - Comentario del usuario. **Obligatorio.**
 * @property {number} rating - Calificación entre 1 y 5. **Obligatorio.**
 * @property {Date} createdAt - Fecha de creación.
 * @property {Date} updatedAt - Última fecha de actualización.
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
 * Índice compuesto para evitar que un mismo usuario reseñe la misma película varias veces.
 */
ReviewSchema.index({ userId: 1, movieId: 1 }, { unique: true });

/**
 * Modelo de Mongoose para 'Review'.
 */
const Review: Model<IReviewDocument> = mongoose.model<IReviewDocument>("Review", ReviewSchema);

export default Review;
