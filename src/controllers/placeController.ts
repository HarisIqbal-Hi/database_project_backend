import {Request, Response} from "express";
import * as placeModel from "../models/placeModel";

export async function listPlaces(req: Request, res: Response) {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const search = req.query.search as string | undefined;
    const places = await placeModel.getPlaces({categoryId, search});
    res.json({places});
}

export async function getPlace(req: Request, res: Response) {
    const id = Number(req.params.id);
    const place = await placeModel.getPlaceById(id);
    if (!place) {
        res.status(404).json({error: "Place not found."});
        return
    }
    res.json({place});
}

export async function getPlacesGeoJSON(req: Request, res: Response, next: Function) {
    try {
        const geojson = await placeModel.getPlacesGeoJSON();
        res.json(geojson);
    } catch (e) {
        next(e);
    }
}
