import express from 'express';
import userRoutes from './userRoutes';
import pexelsServiceRoutes from "./pexelsServiceRoutes";
import reviewRoutes from "./reviewRoutes";



const router = express.Router();

router.use('/users', userRoutes);
router.use("/pexels", pexelsServiceRoutes);
router.use("/reviews", reviewRoutes);


export default router;