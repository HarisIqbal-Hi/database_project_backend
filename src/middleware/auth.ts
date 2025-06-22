import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.access_token;
    if (!token) {
        res.status(401).json({error: "Not authenticated."});
        return
    }
    try {
        req.user = jwt.verify(token, ACCESS_SECRET) as any;
        next();
    } catch (e) {
        res.status(401).json({error: "Invalid or expired token."});
    }
}
