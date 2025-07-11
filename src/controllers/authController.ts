import jwt from "jsonwebtoken";
import {Request, Response} from "express";
import * as authModel from "../models/authModel";
import bcrypt from "bcryptjs";

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

function generateAccessToken(user: any) {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        ACCESS_SECRET,
        { expiresIn: "15m" }
    );
}

function generateRefreshToken(user: any) {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        REFRESH_SECRET,
        { expiresIn: "2d" }
    );
}

function setTokens(res: Response, user: any) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    });

    return { accessToken, refreshToken };
}

// --- Signup ---
export async function signup(req: Request, res: Response) {
    console.log("test server");
    const { username, email, password, full_name } = req.body;
    if (!username || !email || !password || !full_name) {
        res.status(400).json({ error: "All fields are required." });
        return
    }

    const existing = await authModel.findUserByUsername(username);
    if (existing) {
        res.status(409).json({ error: "Username already taken." });
        return
    }

    const hash = await bcrypt.hash(password, 10);

    try {
        const user = await authModel.createUser(username, email, hash,full_name);
        setTokens(res, user);
        console.log("user",user);
        res.status(201).json({ user: { id: user.id, username, email } });
        return
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating user." });
        return
    }
}

// --- Login ---
export async function login(req: Request, res: Response) {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        res.status(400).json({ error: "Username and password required." });
        return
    }

    const user = await authModel.findUserByUsername(username);
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        res.status(401).json({ error: "Invalid username or password." });
        return
    }

    setTokens(res, user);
    res.json({
        message: "Login successful.",
        user: { id: user.id, username: user.username, email: user.email }
    });
    return
}


export async function refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        res.status(401).json({ error: "No refresh token provided." });
        return
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;
        const user = await authModel.findUserByUsername(payload.username);
        if (!user) {
            res.status(401).json({ error: "User not found." });
            return
        }

        setTokens(res, user); // Rotates both tokens, refresh window slides
        res.json({ message: "Tokens refreshed." });
        return
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired refresh token." });
        return
    }
}
export function logout(req: Request, res: Response) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.json({ message: "Logged out." });
}