import express from "express";
import { authenticate } from "../middleware/auth";
import { createReview, getPlaceReviews } from "../controllers/reviewController";

const router = express.Router();

router.post("/", authenticate, createReview);         // POST /api/reviews
router.get("/:id", getPlaceReviews);                  // GET /api/reviews/:id (id = placeId)

export default router;
/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a review and vibe rating for a place
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placeId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               vibe_rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *             required: [placeId, rating, vibe_rating]
 *     responses:
 *       201:
 *         description: Review submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *
 * /api/reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews for a place
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Place ID
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 */
