import { Router } from "express";
import * as visitedController from "../controllers/visitedController";
import {authenticate} from "../middleware/auth";


const router = Router();

router.get("/", authenticate, visitedController.getVisited); // Get all visited places
router.post("/", authenticate, visitedController.addVisited); // Mark as visited
router.delete("/", authenticate, visitedController.removeVisited); // Unmark as visited
router.get("/isVisited", authenticate, visitedController.isVisited); // Check if visited

export default router;
