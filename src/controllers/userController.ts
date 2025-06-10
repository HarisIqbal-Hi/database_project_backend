import {Request, Response} from "express";
import * as userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// PATCH /api/user/me
export async function updateProfile(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const {name, location} = req.body;

        if (name !== undefined && typeof name !== "string") {
            res.status(400).json({error: "Name must be a string."});
            return
        }
        if (location !== undefined && typeof location !== "string") {
            res.status(400).json({error: "Location must be a string."});
            return
        }

        const result = await userModel.updateUser(userId, name, location);
        res.json({user: result});
    } catch (e) {
        next(e);
    }
}

// GET /api/user/me
export async function getProfile(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const user = await userModel.findUserById(userId);
        res.json({user});
    } catch (e) {
        next(e);
    }
}
