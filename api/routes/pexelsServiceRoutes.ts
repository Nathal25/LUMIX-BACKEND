// import express from "express";
// import PexelsController from "../controllers/PexelsController";
// import authenticateToken from "../middlewares/authMiddleware";

// const router = express.Router();

// /**
//  * @route POST /pexels/search
//  * @description Busca videos o imágenes en Pexels según una palabra clave.
//  * @query {string} query - Palabra clave para buscar (ejemplo: "nature", "space").
//  * @query {number} [per_page=10] - Número de resultados por página.
//  * @returns 200 con una lista de resultados (videos o fotos).
//  * @access Public
//  */
// router.post("/search", (req, res) => PexelsController.searchMedia(req, res));

// /**
//  * @route POST /pexels/popular
//  * @description Obtiene una lista de videos populares de Pexels.
//  * @query {number} [per_page=10] - Número de resultados a devolver.
//  * @returns 200 con la lista de videos populares.
//  * @access Public
//  */
// router.post("/popular", (req, res) => PexelsController.getPopularVideos(req, res));

// /**
//  * @route GET /pexels/protected
//  * @description Ejemplo de endpoint protegido (requiere autenticación JWT).
//  * @returns 200 con un mensaje de acceso autorizado.
//  * @access Private
//  */
// router.get("/protected", authenticateToken, (req, res) => {
//   res.status(200).json({ message: "Acceso autorizado al contenido protegido de Pexels." });
// });

// export default router;
