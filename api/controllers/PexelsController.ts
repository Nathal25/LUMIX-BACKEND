import { Request, Response } from "express";
import { searchVideos, getPopularVideos } from "../services/pexelsService";

class PexelsController {
  static async searchMedia(req: Request, res: Response) {
    try {
      const { query, per_page } = req.query;

      if (!query) {
        return res.status(400).json({ message: "Debes proporcionar un término de búsqueda (query)." });
      }

      const results = await searchVideos(String(query), Number(per_page) || 10);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error al buscar en Pexels:", error);
      res.status(500).json({ message: "Error al comunicarse con Pexels." });
    }
  }

  static async getPopularVideos(req: Request, res: Response) {
    try {
      const { per_page } = req.query;
      const results = await getPopularVideos(Number(per_page) || 10);
      res.status(200).json(results);
    } catch (error) {
      console.error("Error al obtener videos populares:", error);
      res.status(500).json({ message: "Error al comunicarse con Pexels." });
    }
  }
}

export default PexelsController;
