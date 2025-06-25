import express from "express";
import * as placeController from "../controllers/placeController";
import { usersAtPlace, matchUsersAtPlace } from "../controllers/userController";
import {authenticate} from "../middleware/auth";

const router = express.Router();

router.get("/",authenticate, placeController.listPlaces);         // GET /places?categoryId=1&search=keyword
router.get("/:id",authenticate, placeController.getPlace);        // GET /places/123
router.get("/geojson", placeController.getPlacesGeoJSON);
router.get("/:id/users", usersAtPlace);
router.get("/:id/match", authenticate, matchUsersAtPlace);

export default router;
/**
 * @swagger
 * /api/places/{id}/users:
 *   get:
 *     tags: [Places]
 *     summary: List all users currently checked in at this place
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Place ID
 *     responses:
 *       200:
 *         description: List of users checked in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *
 * /api/places/{id}/match:
 *   get:
 *     tags: [Places]
 *     summary: List users checked in at this place who share your interests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Place ID
 *     responses:
 *       200:
 *         description: List of matching users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 matches:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
