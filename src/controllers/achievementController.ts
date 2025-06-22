import { Request, Response } from "express";
import * as achievementModel from "../models/achievementModel";

// Get a user's achievements
export async function getMyAchievements(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const achievements = await achievementModel.getAchievements(userId);
        res.json({ achievements });
    } catch (e) {
        next(e);
    }
}