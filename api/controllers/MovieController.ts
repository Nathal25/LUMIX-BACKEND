import { Request, Response } from "express";
import MovieDAO from "../dao/MovieDAO";
import { searchVideos, getPopularVideos } from "../services/pexelsService";

class MovieController {
  /**
   * @route GET /movies/popular/:pages
   * @description Fetches popular movies from Pexels, stores them in the database if they do not exist, and returns them.
   * @param {Request} req - Express request object, containing the number of pages to fetch in `req.params.pages`.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} 200 with an array of movies or 500 if an error occurs.
   * @access Public
   */
  async getPopularMovies(req: Request, res: Response) {
    try {
      const pages = Number(req.params.pages);
      const videos = await getPopularVideos(pages);
      const movies = [];

      for (const video of videos) {
        const movie = await this.createMovieFromPexelsData(video);
        if (movie) movies.push(movie);
      }

      return res.status(200).json(movies);
    } catch (error) {
      console.error("Error al obtener películas populares:", error);
      return res.status(500).json({ message: "Error al obtener películas populares." });
    }
  }

  /**
   * @route POST /movies/search
   * @description Searches for movies by category on Pexels, saves them if they do not exist, and returns the results.
   * @param {Request} req - Express request object containing `category` and optional `pages` in the body.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} 200 with the found movies, 400 if the category is missing, or 500 on error.
   * @access Public
   */
  async searchMoviesByCategory(req: Request, res: Response) {
    try {
      const category = String(req.body.category);
      const pages = Number(req.body.pages);

      if (!category) {
        return res.status(400).json({ message: "Debes proporcionar una categoría o término de búsqueda." });
      }

      const videos = await searchVideos(category, pages);
      const movies = [];

      for (const video of videos) {
        const movie = await this.createMovieFromPexelsData(video);
        if (movie) movies.push(movie);
      }

      return res.status(200).json(movies);
    } catch (error) {
      console.error("Error al buscar películas:", error);
      return res.status(500).json({ message: "Error al buscar películas." });
    }
  }

  /**
   * @route GET /movies
   * @description Retrieves all locally stored movies from the database.
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} 200 with an array of movies or 500 if an error occurs.
   * @access Public
   */
  async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await MovieDAO.getAll();
      return res.status(200).json(movies);
    } catch (error) {
      console.error("Error al obtener películas:", error);
      return res.status(500).json({ message: "Error al obtener las películas locales." });
    }
  }

  /**
   * @route GET /movies/:id
   * @description Retrieves a movie by its ID from the database.
   * @param {Request} req - Express request object containing the movie ID in `req.params.id`.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} 200 with the movie, 404 if not found, or 500 if an error occurs.
   * @access Public
   */
  async getMovieById(req: Request, res: Response) {
    try {
      const movieId = req.params.id;
      const movie = await MovieDAO.read(movieId);
      if (!movie) {
        return res.status(404).json({ message: "Película no encontrada." });
      }
      return res.status(200).json(movie);
    } catch (error) {
      console.error("Error al obtener película por ID:", error);
      return res.status(500).json({ message: "Error al obtener la película." });
    }
  }

  /**
   * @description Creates a movie document from Pexels data if it does not already exist in the database.
   * @private
   * @param {any} pexelsData - The raw video data obtained from the Pexels API.
   * @returns {Promise<object|null>} The created or existing movie document, or null if an error occurs.
   */
  private async createMovieFromPexelsData(pexelsData: any) {
    try {
      const existing = await MovieDAO.findByPexelsId(pexelsData.id);
      if (existing) return existing; // Evita duplicados

      const movie = await MovieDAO.create({
        pexelsId: pexelsData.id,
        title: this.formatTitleFromUrl(pexelsData.url),
        imageUrl: pexelsData.image,
        videoUrl: pexelsData.video_files[0]?.link,
        duration: pexelsData.duration,
        author: pexelsData.user.name,
        description: `Video creado por ${pexelsData.user.name} traído de Pexels`,
      });

      return movie;
    } catch (error) {
      console.error("Error al crear película desde datos de Pexels:", error);
      return null;
    }
  }

  /**
   * @description Cleans up and formats a title extracted from a Pexels URL.
   * @private
   * @param {string} url - The Pexels video URL.
   * @returns {string} A formatted movie title.
   */
  private formatTitleFromUrl(url: string): string {
    return (
      url
        ?.split("/video/")[1]
        ?.replace(/-/g, " ")
        ?.replace(/\d+\/?$/, "")
        ?.trim() || "Sin título"
    );
  }
}

export default new MovieController();

