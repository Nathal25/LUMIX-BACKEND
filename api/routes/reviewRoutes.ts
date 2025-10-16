import express from "express";
import ReviewController from "../controllers/ReviewController";
import authenticateToken from "../middlewares/authMiddleware"
const router = express.Router();

router.post("/", authenticateToken, ReviewController.create);
router.get("/movie/:movieId", ReviewController.getByMovie);
router.get("/user/:userId", authenticateToken, ReviewController.getByUser);
router.get("/average/:movieId", ReviewController.getAverageRating);
router.put("/", authenticateToken, ReviewController.update);
router.delete("/:id", authenticateToken, ReviewController.delete);

export default router;
