import FavoriteDAO from "../dao/FavoriteDAO";
import { Request, Response } from "express";

class FavoriteController {
    /**
    * @route POST /favorites
    * @description Creates a new favorite for a user.
    * @param {Request} req - Express request object containing `userId` and `movieId` in the body.
    * @param {Response} res - Express response object.
    * @returns {Promise<void>} 201 with the created favorite, 400 if required fields are missing, or 500 on error.
    * @access Public
    */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { userId, movieId } = req.body;

            if (!userId || !movieId) {
                res.status(400).json({ message: "Missing userId or movieId" });
                return;
            }

            const favorite = await FavoriteDAO.create(req.body);
            res.status(201).json(favorite);
        } catch (error: any) {
            if (process.env.NODE_ENV === "development") {
                console.error("Error creating favorite:", error);
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    /**
    * @route GET /favorites/user/:id
    * @description Retrieves all favorite movies for a specific user.
    * @param {Request} req - Express request object containing the user ID in `req.params.id`.
    * @param {Response} res - Express response object.
    * @returns {Promise<void>} 200 with an array of favorites, 400 if userId is missing, or 500 on error.
    * @access Public
    */
    async getByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.params.id;

            if (!userId) {
                res.status(400).json({ message: "Missing userId parameter" });
                return;
            }

            const favorites = await FavoriteDAO.getByUser(userId);
            res.status(200).json(favorites);
        } catch (error: any) {
            if (process.env.NODE_ENV === "development") {
                console.error("Error getting favorites:", error);
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    /**
    * @route DELETE /favorites/movie/:id
    * @description Deletes a favorite by its movie ID.
    * @param {Request} req - Express request object containing the favorite ID in `req.params.id`.
    * @param {Response} res - Express response object.
    * @returns {Promise<void>} 200 if deleted successfully, 404 if not found, or 500 on error.
    * @access Public
    */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "Missing favorite ID" });
                return;
            }

            const deleted = await FavoriteDAO.delete(id);
            if (!deleted) {
                res.status(404).json({ message: "Favorite not found" });
                return;
            }

            res.status(200).json({ message: "Favorite deleted successfully" });
        } catch (error: any) {
            if (process.env.NODE_ENV === "development") {
                console.error("Error deleting favorite:", error);
            }
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export default new FavoriteController();