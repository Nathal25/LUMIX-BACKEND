// // import { Request, Response } from "express";
// // import MovieDAO from "../dao/MovieDAO";
// // import { generateImageCaption } from "../services/subtitleService";

// // class SubtitleController2 {
// //   /**
// //    * @route GET /sb/:id/subtitles
// //    * @description Genera subtítulos descriptivos para un video existente en la base de datos.
// //    */
// //   async generate(req: Request, res: Response) {
// //     try {
// //       const movieId = req.params.id;
// //       const movie = await MovieDAO.read(movieId);

// //       if (!movie) {
// //         return res.status(404).json({ message: "Película no encontrada." });
// //       }

// //       console.log(`Generando subtítulos para: ${movie.title}`);
// //       const srt = await generateImageCaption(movie.imageUrl as string);

// //       return res.status(200).json({ movieId, title: movie.title, subtitles: srt });
// //     } catch (error) {
// //       console.error("Error al generar subtítulos:", error);
// //       return res.status(500).json({ message: "Error al generar subtítulos." });
// //     }
// //   }
// // }

// // export default new SubtitleController2();

// import { Request, Response } from "express";
// import MovieDAO from "../dao/MovieDAO";
// import { generateSubtitlesFromVideo } from "../services/subtitleService";

// class SubtitleController2 {
//   async generate(req: Request, res: Response) {
//     try {
//       const movieId = req.params.id;
//       const movie = await MovieDAO.read(movieId);

//       if (!movie) {
//         return res.status(404).json({ message: "Película no encontrada." });
//       }

//       if (!movie.videoUrl) {
//         return res.status(400).json({ message: "La película no tiene URL de video." });
//       }

//       console.log(`Generando subtítulos para: ${movie.title}`);
//       const srt = await generateSubtitlesFromVideo(movie.videoUrl as string);

//       return res.status(200).json({ 
//         movieId, 
//         title: movie.title, 
//         subtitles: srt,
//         format: "srt"
//       });
//     } catch (error: any) {
//       console.error("Error al generar subtítulos:", error);
//       return res.status(500).json({ 
//         message: "Error al generar subtítulos.",
//         error: error.message 
//       });
//     }
//   }
// }

// export default new SubtitleController2();