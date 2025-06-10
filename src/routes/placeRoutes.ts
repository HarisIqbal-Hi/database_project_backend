import express from "express";
import * as placeController from "../controllers/placeController";

const router = express.Router();

router.get("/", placeController.listPlaces);         // GET /places?categoryId=1&search=keyword
router.get("/:id", placeController.getPlace);        // GET /places/123
router.get("/geojson", placeController.getPlacesGeoJSON);

export default router;
/**
 * @swagger
 * tags:
 *   name: Places
 *   description: Manage cultural sites
 */

/**
 * @swagger
 * /places:
 *   get:
 *     summary: Get all places (with optional filter/search)
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name
 *     responses:
 *       200:
 *         description: List of places
 */

/**
 * @swagger
 * /places/{id}:
 *   get:
 *     summary: Get place details by ID
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Place details
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /places/geojson:
 *   get:
 *     summary: Get all places as a GeoJSON FeatureCollection
 *     tags: [Places]
 *     responses:
 *       200:
 *         description: GeoJSON data
 */
