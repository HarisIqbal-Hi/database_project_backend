import {Request, Response} from "express";
import * as achievementModel from "../models/achievementModel";
import {getTotalPlacesCount} from "../models/placeModel";
import {getTotalFavoritesCount} from "../models/favoriteModel";

// Get a user's achievements
const VISIT_MILESTONES = [1, 5, 10, 25, 50, 100, 200, 300];
const FAVORITE_MILESTONES = [1, 5, 15, 30, 60, 100];
const COMBO_MILESTONES = [1, 5, 15, 30, 60, 100];

export async function getUserAchievements(req: Request, res: Response) {
    const userId = req.user.id;
    const stats = await achievementModel.getUserStats(userId);
    const totalPlaces = await getTotalPlacesCount();
    const totalFavorites = await getTotalFavoritesCount();

    // Calculate visited + favorite overlap
    const visitedFavorites = stats.visitedPlaceIds.filter(id =>
        stats.favoritePlaceIds.includes(id)
    );
    const numVisitedFavorites = visitedFavorites.length;

    // Only award "visited" and "combo" (visited+favorite) achievements
    for (const count of VISIT_MILESTONES) {
        if (stats.visited >= count) {
            await achievementModel.upsertAchievement(
                userId,
                "visited",
                `Explorer: Visited ${stats.visited} of ${totalPlaces} places`
            );
        }
    }

    for (const count of COMBO_MILESTONES) {
        if (numVisitedFavorites >= count) {
            await achievementModel.upsertAchievement(
                userId,
                "combo",
                `Connoisseur: Visited & Favorited ${numVisitedFavorites} of ${totalFavorites} places`
            );
        }
    }

    // Fetch latest achievements
    const achievements = await achievementModel.getAchievements(userId);

    console.log("total",totalFavorites);
// Add detailed info for only "visited" and "combo" types
    const formattedAchievements = achievements
        .filter(a => a.type === "visited" || a.type === "combo")
        .map(a => {
            let value = 0, total =  a.type === "combo" ? totalFavorites : totalPlaces;
            if (a.type === "visited") value = stats.visited;
            if (a.type === "combo") value = numVisitedFavorites;

            return {
                ...a,           // id, user_id, type, description, created_at, etc.
                value,
                total,
                progress: `${value} / ${total}`
            };
        });

    res.json({
        achievements: formattedAchievements,
        stats,
        totalPlaces
    });

    res.json({achievements, stats, totalPlaces});
}
