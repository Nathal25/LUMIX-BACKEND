import express from "express";
import SubtitleController from "../controllers/SubtitleController";

const router = express.Router();

/**
 * @route GET /sb/:id/subtitles/en
 * @description Genera subtítulos en inglés para un video existente.
 */
router.get("/:id/subtitles/en", (req, res) => SubtitleController.generateEnglish(req, res));

/**
 * @route GET /sb/:id/subtitles/es
 * @description Genera subtítulos en español (traducidos) para un video existente.
 */
router.get("/:id/subtitles/es", (req, res) => SubtitleController.generateSpanish(req, res));

//router.get("/:id/prueba", (req, res) => SubtitleController2.generate(req, res));

export default router;