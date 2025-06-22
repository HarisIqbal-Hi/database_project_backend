import express from "express";
import { authenticate } from "../middleware/auth";
import { getMyAchievements } from "../controllers/achievementController";

const router = express.Router();

router.get("/", authenticate, getMyAchievements);

export default router;
/**
 * @swagger
 * /api/achievements:
 *   get:
 *     tags: [Achievements]
 *     summary: Get your earned achievements
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of achievements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 achievements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Achievement'
 */
