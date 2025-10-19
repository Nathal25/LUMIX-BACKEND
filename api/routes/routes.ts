import express from 'express';
import userRoutes from './userRoutes';
//import pexelsServiceRoutes from "./pexelsServiceRoutes";
import reviewRoutes from "./reviewRoutes";
import favoriteRoutes from "./favoriteRoutes";
import movieRoutes from './movieRoutes';

const router = express.Router();

router.use('/users', userRoutes);
//router.use("/pexels", pexelsServiceRoutes);
router.use("/movies", movieRoutes);
router.use("/reviews", reviewRoutes);
router.use("/favorites", favoriteRoutes);


export default router;