import * as visitedModel from "../models/visitedModel";
import {Request, Response} from "express";

export async function addVisited(req: Request, res: Response,  next: Function) {
    try {
        const userId = req.user.id;
        const { placeId } = req.body;
        await visitedModel.addVisited(userId, placeId);
        res.json({ success: true });
    } catch (err) { next(err); }
}

export async function removeVisited(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const { placeId } = req.body;
        await visitedModel.removeVisited(userId, placeId);
        res.json({ success: true });
    } catch (err) { next(err); }
}

export async function getVisited(req: Request, res: Response,  next: Function) {
    try {
        const userId = req.user.id;
        const places = await visitedModel.getVisited(userId);
        res.json({ places });
    } catch (err) { next(err); }
}

export async function isVisited(req: Request, res: Response,  next: Function) {
    try {
        const userId = req.user.id;
        const { placeId } = req.query;
        const visited = await visitedModel.isVisited(userId, Number(placeId));
        res.json({ visited });
    } catch (err) { next(err); }
}
