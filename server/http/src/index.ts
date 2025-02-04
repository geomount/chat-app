import express, {Response, Request} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from "path";
import { JWT_SECRET } from './config';
import { prismaClient } from './../../db/src/';


const app = express();
const PORT = 3005;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));


app.get("/", (req: Request, res: Response) => {
    
    res.send("Hello from the HTTP Server")
})

app.post("/signup", async (req: Request, res: Response): Promise<void> => {

    //ToDO: add zod schema
    try {
        const {username, email, password, age, photo} = req.body;

        if (!username || !email || !password || !age) {
            res.status(400).json({
                message: "All fields are mandatory"
            })
            return 
        }

        const existingEmail = await prismaClient.user.findFirst({where: email});
        const existingUsername = await prismaClient.user.findFirst({where: email});
        if (existingEmail) {
            res.status(400).json({
                message: "Email already in use"
            })
            return 
        }

        if (existingUsername) {
            res.status(400).json({
                message: "Username already in use"
            })
            return 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prismaClient.user.create({
            data:{
                username,
                email,
                password: hashedPassword,
                age,
                photo
            }

        });

        res.status(201).json({
            message: "User Successfully created",
            user: {
                id: newUser.id,
                photo: newUser.photo,
                username: newUser.username, 
                email: newUser.email,
                age: newUser.age
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error! Pls try again"
        })
        return 
    }
   

})



app.post("/signin", async (req: Request, res: Response): Promise<void> => {

    try {
        const {username, password}: {username: string, password: string} = req.body;

        if (!username || !password) {
            res.status(400).json({
                message: "All fields are mandatory"
            })
            return 
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismaClient.user.findFirst(
            {where: {
                username: username, 
                password: hashedPassword
            }});

        if (!user) {
            res.status(400).json({
                message: "Invalid Username or Password"
            })
            return 
        }

        const token = jwt.sign({
            id: user.id
        }, JWT_SECRET);

        res.cookie("token", token);
    
        res.send({
            message: "SignIn Successful! Welcome User"
        })


    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error! Pls try again"
        })
        return 
    }
   
})



app.listen(PORT, () => {
    `HTTP server on PORT: ${PORT}`
});