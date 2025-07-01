import {Request, Response} from "express";
import * as userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as achievementModel from "../models/achievementModel";

// PATCH /api/user/me
export async function updateProfile(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const {name, location, interests, email} = req.body;

        if (name !== undefined && typeof name !== "string") {
            res.status(400).json({error: "Name must be a string."});
            return
        }
        let locationPoint = null;
        if (location && typeof location === 'object') {
            locationPoint = `POINT(${location.lng} ${location.lat})`;
        }
        if (locationPoint !== undefined && typeof locationPoint !== "string") {
            res.status(400).json({error: "Please select a location."});
            return
        }

        console.log("update userinformation", name, location, interests, email);
        const result = await userModel.updateUser(userId, name, locationPoint,interests, email);
        console.log(result);
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
        console.log("user information",user);
        res.json({user});
    } catch (e) {
        next(e);
    }
}

// PATCH /api/user/interests
export async function updateInterests(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const { interests } = req.body;
        if (!Array.isArray(interests)) {
            res.status(400).json({ error: "Interests must be an array of strings." });
            return;
        }
        const user = await userModel.setInterests(userId, interests);
        res.json({ user });
    } catch (e) {
        next(e);
    }
}

// POST /api/user/checkin
export async function checkin(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const { placeId } = req.body;
        if (!placeId) {
            res.status(400).json({ error: "placeId is required." });
            return;
        }
        const user = await userModel.checkinPlace(userId, placeId);
        await achievementModel.addAchievement(userId, "checkin", `Checked in at place ${placeId}`);
        res.json({ message: "Checked in.", user });
    } catch (e) {
        next(e);
    }
}

// GET /api/places/:id/users
export async function usersAtPlace(req: Request, res: Response, next: Function) {
    try {
        const placeId = Number(req.params.id);
        const users = await userModel.getUsersCheckedIn(placeId);
        res.json({ users });
    } catch (e) {
        next(e);
    }
}

// GET /api/places/:id/match
export async function matchUsersAtPlace(req: Request, res: Response, next: Function) {
    try {
        const userId = req.user.id;
        const placeId = Number(req.params.id);

        const me = await userModel.findUserById(userId);
        const myInterests: string[] = me.interests || [];

        const users = await userModel.getUsersCheckedIn(placeId);

        // Only those with at least one shared interest, and not yourself
        const matches = users.filter((u: any) =>
            u.id !== userId &&
            u.interests &&
            u.interests.some((i: string) => myInterests.includes(i))
        );

        res.json({ matches });
    } catch (e) {
        next(e);
    }
}
