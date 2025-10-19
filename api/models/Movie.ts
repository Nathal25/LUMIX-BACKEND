import mongoose, {Document, Schema, Model} from "mongoose";

/**
 * Interface that represents a Movie.
 * Defines the properties of a movie object.
*/
export interface IMovie {
    pexelsId: Number, // ID of the movie in Pexels 
    title: String,
    imageUrl: String, // Preview image URL
    videoUrl: String, // Video file URL   
    duration: Number,
    author: String,
    description: String,
}

/**
 * Interface that represents a Movie document in Mongoose.
 * Combines IMovie with the properties of Document (like _id, save, etc.).
*/
export interface IMovieDocument extends IMovie, Document {}

/**
 * @typedef {Object} Movie
 * @property {number} pexelsId - ID of the movie in Pexels. **Required.**
 * @property {string} title - Title of the movie. **Required.**
 * @property {string} imageUrl - Preview image URL. **Required.**
 * @property {string} videoUrl - Video file URL. **Required.**
 * @property {number} duration - Duration of the movie in seconds. **Required.**
 * @property {string} author - Author of the movie. **Required.**
 * @property {string} description - Description of the movie. **Required.**
*/
/**
 * Mongoose schema for the `Movie` model.
 * 
 * Defines validation rules, default values, and constraints for movie data.
*/
const MovieSchema: Schema<IMovieDocument> = new Schema(
    {
        pexelsId: { type: Number, required: true }, // ID of the movie in Pexels
        title: { type: String, required: true },
        imageUrl: { type: String, required: true }, // Preview image URL
        videoUrl: { type: String, required: true }, // Video file URL
        duration: { type: Number, required: true },
        author: { type: String, required: true },
        description: { type: String, required: true },
    },
    { 
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

/**
 * Mongoose model for 'Movie'.
 * The generic type <IMovieDocument> helps TypeScript infer types in queries.
*/
const Movie: Model<IMovieDocument> = mongoose.model<IMovieDocument>("Movie", MovieSchema);

export default Movie;