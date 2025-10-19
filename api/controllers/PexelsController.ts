// import { Request, Response } from "express";
// import { searchVideos, getPopularVideos } from "../services/pexelsService";
// import MovieController from "./MovieController";

// class PexelsController {
//   static async searchMedia(req: Request, res: Response) {
//     try {
//       if (!req.body.category) {
//         return res.status(400).json({ message: "Debes proporcionar un término de búsqueda (query)." });
//       }

//       const results = await searchVideos(String(req.body.category), Number(req.body.pages) || 10);
//       res.status(200).json(results);
//     } catch (error) {
//       console.error("Error al buscar en Pexels:", error);
//       res.status(500).json({ message: "Error al comunicarse con Pexels." });
//     }
//   }

//   static async getPopularVideos(req: Request, res: Response) {
//     try {
//       const results = await getPopularVideos(Number(req.body.pages) || 3);

//       const movies = [];
//       for (const video of results) {
//         const movie = await MovieController.createMovieFromPexelsData(video);
//         movies.push(movie);
//       }

//       res.status(200).json(movies);
//     } catch (error) {
//       console.error("Error al obtener videos populares:", error);
//       res.status(500).json({ message: "Error al comunicarse con Pexels." });
//     }
//   }  
// }

// export default PexelsController;
