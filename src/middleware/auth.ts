import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.access_token;
    if (!token) {
        res.status(401).json({error: "Not authenticated."});
        return
    }
    try {
        const payload = jwt.verify(token, ACCESS_SECRET) as any;
        req.user = payload;
        next();
    } catch (e) {
        res.status(401).json({error: "Invalid token."});
    }
}