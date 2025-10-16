import { Request, Response } from "express";
import ReviewDAO from "../dao/ReviewDAO";

/**
 * Controller encargado de gestionar las reseñas (reviews) de películas.
 * 
 * Este controlador maneja:
 * - Creación de nuevas reseñas.
 * - Obtención de reseñas por película o usuario.
 * - Cálculo del promedio de calificaciones.
 * - Actualización y eliminación de reseñas existentes.
 */
class ReviewController {
  /**
   * Crea una nueva reseña para una película.
   * 
   * @route POST /api/reviews
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP.
   * 
   * @bodyParam {string} userId - ID del usuario que crea la reseña.
   * @bodyParam {string} movieId - ID de la película (por ejemplo, de Pexels).
   * @bodyParam {string} comment - Texto de la reseña.
   * @bodyParam {number} rating - Calificación del usuario (ejemplo: 4.5).
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Previene que un usuario reseñe la misma película más de una vez.  
   * - Devuelve la reseña creada si la operación es exitosa.  
   * - Respuestas posibles:
   *   - 201: Reseña creada exitosamente.
   *   - 400: Faltan campos obligatorios.
   *   - 409: Ya existe una reseña para esa película del mismo usuario.
   *   - 500: Error interno del servidor.
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
   * Obtiene todas las reseñas asociadas a una película.
   * 
   * @route GET /api/reviews/movie/:movieId
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP.
   * 
   * @paramParam {string} movieId - ID de la película a consultar.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Devuelve un arreglo con todas las reseñas de la película especificada.  
   * - Respuestas posibles:
   *   - 200: Reseñas encontradas.
   *   - 404: No hay reseñas para la película indicada.
   *   - 500: Error interno del servidor.
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
   * Obtiene todas las reseñas creadas por un usuario.
   * 
   * @route GET /api/reviews/user/:userId
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP.
   * 
   * @paramParam {string} userId - ID del usuario del cual se quieren obtener las reseñas.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Devuelve todas las reseñas realizadas por un usuario específico.  
   * - Respuestas posibles:
   *   - 200: Reseñas encontradas.
   *   - 404: El usuario no ha realizado ninguna reseña.
   *   - 500: Error interno del servidor.
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
   * Obtiene el promedio de calificaciones de una película.
   * 
   * @route GET /api/reviews/movie/:movieId/average
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP.
   * 
   * @paramParam {string} movieId - ID de la película.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Calcula el promedio de todas las calificaciones (`rating`) de una película.  
   * - Respuestas posibles:
   *   - 200: Promedio calculado correctamente.
   *   - 500: Error interno del servidor.
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
   * Actualiza una reseña existente de un usuario para una película específica.
   * 
   * @route PUT /api/reviews
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP.
   * 
   * @bodyParam {string} userId - ID del usuario que hizo la reseña.
   * @bodyParam {string} movieId - ID de la película reseñada.
   * @bodyParam {string} [comment] - Nuevo comentario (opcional).
   * @bodyParam {number} [rating] - Nueva calificación (opcional).
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Permite modificar una reseña existente según el usuario y la película.  
   * - Respuestas posibles:
   *   - 200: Reseña actualizada correctamente.
   *   - 404: No se encontró la reseña.
   *   - 500: Error interno del servidor.
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
   * Elimina una reseña específica por su ID.
   * 
   * @route DELETE /api/reviews/:id
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP.
   * 
   * @paramParam {string} id - ID de la reseña a eliminar.
   * 
   * @returns {Promise<void>}
   * 
   * @description
   * - Elimina una reseña según su ID.  
   * - Respuestas posibles:
   *   - 200: Reseña eliminada correctamente.
   *   - 500: Error interno del servidor.
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
