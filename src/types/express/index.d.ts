import "express";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Use 'any' or better: a proper user type
        }
    }
}