import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import path from "path";

function Auth (req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;
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


export {Auth}