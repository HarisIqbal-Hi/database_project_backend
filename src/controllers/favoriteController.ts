import {Request, Response} from "express";
import * as favoriteModel from "../models/favoriteModel";

export async function addFavorite(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const { placeId } = req.body;

        if (typeof placeId !== "number" || isNaN(placeId)) {
             res.status(400).json({ error: "placeId must be a number." });
            return
        }

        const favorite = await favoriteModel.addFavorite(userId, placeId);
        if (!favorite) {
             res.status(200).json({ message: "Already favorited." });
            return
        }
        res.status(201).json({ message: "Added to favorites.", favorite });
    } catch (e) {
        next(e);
    }
}


export async function removeFavorite(req: Request, res: Response) {
    const userId = req.user.id;
    const {placeId} = req.params;
    await favoriteModel.removeFavorite(userId, Number(placeId));
    res.json({message: "Removed from favorites."});
}

export async function getFavorites(req: Request, res: Response) {
    const userId = req.user.id;
    const favorites = await favoriteModel.getFavorites(userId);
    res.json({favorites});
}

