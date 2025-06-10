import express from "express";
import * as categoryController from "../controllers/categoryController";
const router = express.Router();
router.get("/", categoryController.listCategories); // GET /categories
export default router;


/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: List all categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */

