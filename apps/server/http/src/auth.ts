import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import path from "path";

interface RequestWithUser extends Request {
    userId?: string
}

export function Auth (req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
            if (!decoded) {
                res.status(403).json({
                    message: "Unauthorized: Invalid token",
                });
    
                return
            }
            req.userId = decoded.userId;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            res.send('Not authorized, token failed');

        }
    } else {
        res.status(401);
        res.send('Not authorized, no token');
    }
}   