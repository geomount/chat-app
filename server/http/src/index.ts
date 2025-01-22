import express, {Response, Request} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from "path";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

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

    try {
        const {username, name, email, password, age} = req.body;

        if (!username || !name || !email || !password || !age) {
            res.status(400).json({
                message: "All fields are mandatory"
            })
            return 
        }

        const existingEmail = await User.findOne({where: email});
        const existingUsername = await User.findOne({where: email});
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

        const newUser = await UserActivation.create({
            username,
            name, 
            email,
            password: hashedPassword,
            age
        });

        res.status(201).json({
            message: "User Successfully created",
            user: {
                id: newUser.id,
                name: newUser.name,
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
        const {username, password} = req.body;

        if (!username || !password) {
            res.status(400).json({
                message: "All fields are mandatory"
            })
            return 
        }

        const hashedPassword = bcrypt.hash(password, 10);

        const user = await User.findOne({where: {username: username, password: hashedPassword}});

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