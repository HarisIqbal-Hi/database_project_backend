import { Request, Response } from "express";
import * as reviewModel from "../models/reviewModel";
import * as achievementModel from "../models/achievementModel";

export async function createReview(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const { placeId, rating, vibe_rating, comment } = req.body;
        if (
            typeof placeId !== "number" ||
            ![1,2,3,4,5].includes(rating) ||
            ![1,2,3,4,5].includes(vibe_rating)
        ) {
            res.status(400).json({ error: "Invalid rating or vibe rating." });
            return;
        }
        const review = await reviewModel.addReview(userId, placeId, rating, vibe_rating, comment || "");
        await achievementModel.addAchievement(userId, "review", `Left a review at place ${placeId}`);

        res.status(201).json({ message: "Review submitted.", review });
    } catch (e) {
        next(e);
    }
}

export async function getPlaceReviews(req: Request, res: Response, next: Function) {
    try {
        const placeId = Number(req.params.id);
        const reviews = await reviewModel.getReviewsForPlace(placeId);
        res.json({ reviews });
    } catch (e) {
        next(e);
    }
}
