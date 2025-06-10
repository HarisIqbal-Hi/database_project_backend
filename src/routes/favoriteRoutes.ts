import express from "express";
import * as favoriteController from "../controllers/favoriteController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticate, favoriteController.addFavorite);
router.delete("/:placeId", authenticate, favoriteController.removeFavorite);
router.get("/", authenticate, favoriteController.getFavorites);

export default router;

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Manage user favorites
 */

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get current user's favorite places
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of favorite places
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add a place to favorites
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - placeId
 *             properties:
 *               placeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Added to favorites
 *       400:
 *         description: Bad input
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /favorites/{placeId}:
 *   delete:
 *     summary: Remove a place from favorites
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Removed from favorites
 *       401:
 *         description: Not authenticated
 */

