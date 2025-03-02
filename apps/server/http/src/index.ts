import express, {Response, Request, NextFunction} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from "path";
import { JWT_SECRET } from './config';
import { Auth } from './auth';
import { prismaClient } from 'db';

const app = express();

interface RequestWithUser extends Request {
    userId?: string 
}

const PORT = 3005;

const corsOptions = {
    origin: ['http://localhost:5173', 'http://192.168.149.51:5173'], // Specify origins correctly
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};
  
app.use(cors(corsOptions));

app.use((req: Request, res: Response, next: NextFunction) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Origin', 'http://192.168.149.51:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200); // Respond immediately for OPTIONS requests
        return 
    }

    next();
});
  
app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
    
    res.send("Hello from the HTTP Server")
    return 
})

app.post("/api/v0/signup", async (req: Request, res: Response): Promise<void> => {

    //ToDO: add zod schema
    try {
        const {username, email, password, age, photo} = req.body;

        if (!username || !email || !password || !age) {
            res.status(400).json({
                message: "All fields are mandatory"
            })
            return 
        }

        console.log(username, email, password, age);

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

app.post("/api/v0/signin", async (req: Request, res: Response): Promise<void> => {

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

app.post("/api/v0/chatroom", Auth, async (req: RequestWithUser, res: Response) => {

    const userId = req.userId; 

    if (!userId) {
        res.status(403).json({
            message: "User does not exists! Please sign up again"
        })
        return
    }

    try {
        const room = await prismaClient.room.create({
            data: {
                slug: req.body.name,
                adminId: userId
            }
        })

        res.json({
            message: "Room Created Successfully",
            roomId: room.id
        })
        return

        } catch(e) {
            res.status(411).json({
                message: "Room with that slug already exists! Please use different slug"
            })
            return 
        }

})

app.get("/api/v0/chats/:roomId", async (req: Request, res: Response) => {
    const roomId = Number(req.params.roomId)
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    })

    res.json({
        messages
    })
    return 
})

app.get("/api/v0/check-username/:username", async (req: Request, res: Response) => {
    const checkUser = req.params.username;
    const user = await prismaClient.user.findFirst(
        {where: {
            username: checkUser, 
        }});

    if (user) {
        res.json({
            message: "Username already exists! Please try something else",
            isUnique: false
        })
        return 
    }

    res.json({
        message: "Username is available",
        isUnique: true
    })
    return 


})

app.get("/api/v0/check-email/:email", async (req: Request, res: Response) => {
    const checkUser = req.params.email;
    const user = await prismaClient.user.findFirst(
        {where: {
            email: checkUser, 
        }});

    if (user) {
        res.json({
            message: "Email already exists! Please Sign In",
            isUnique: false
        })
        return 
    }

    res.json({
        message: "Email is unique",
        isUnique: true
    })
    return 
})

app.listen(PORT, () => {
    `HTTP server on PORT: ${PORT}`
});