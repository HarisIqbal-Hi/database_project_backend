import express from "express";
import { authenticate } from "../middleware/auth";
import * as userController from "../controllers/userController";
const router = express.Router();

router.patch("/me", authenticate, userController.updateProfile);
router.get("/me", authenticate, userController.getProfile);

export default router;


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile endpoints
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /user/me:
 *   patch:
 *     summary: Update current user's profile
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Bad input
 *       401:
 *         description: Not authenticated
 */
