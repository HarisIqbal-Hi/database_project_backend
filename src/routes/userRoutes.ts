import express from "express";
import { authenticate } from "../middleware/auth";
import { updateProfile, getProfile, updateInterests, checkin } from "../controllers/userController";

const router = express.Router();

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);
router.patch("/interests", authenticate, updateInterests);      // NEW
router.post("/checkin", authenticate, checkin);                 // NEW

export default router;

/**
 * @swagger
 * /api/user/interests:
 *   patch:
 *     tags: [User]
 *     summary: Set or update your interests
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *             required: [interests]
 *     responses:
 *       200:
 *         description: Updated user interests
 *
 * /api/user/checkin:
 *   post:
 *     tags: [User]
 *     summary: Check in to a place
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
 *             required: [placeId]
 *     responses:
 *       200:
 *         description: Checked in
 */
