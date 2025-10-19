import GlobalDao from "./GlobalDAO";
import Movie, { IMovieDocument } from "../models/Movie";
import { FilterQuery } from "mongoose";

/**
 * MovieDAO
 *
 * Data Access Object (DAO) for movie-specific operations.
 * Extends `GlobalDAO` to inherit generic CRUD methods and
 * provides additional operations related to movies.
 *
 * @class MovieDAO
 * @extends GlobalDAO
 */
class MovieDao extends GlobalDao<IMovieDocument> {
  constructor() {
    super(Movie);
  }

  /**
  * Finds a movie document by its Pexels ID.
  *
  * @async
  * @param {number} id - The Pexels video ID to search for.
  * @returns {Promise<IMovieDocument|null>} The found movie document, or `null` if not found.
  * @throws {Error} Throws an error if the database query fails.
  */
  async findByPexelsId(id: number): Promise<IMovieDocument | null> {
    try {
      const document = await this.model.findOne({ pexelsId: id }).exec();
      return document;
    } catch (error: any) {
      throw new Error(`Error getting document by pexelsId: ${error.message}`);
    }
  }
}

/**
 * Exports a instance of MovieDao for use throughout the application.
 */
export default new MovieDao();