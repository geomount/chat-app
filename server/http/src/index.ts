import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
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


app.get("/", (req, res) => {
    
    res.send("Hello from the HTTP Server")
})

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password; 
    const age = req.body.age;

    // make DB call to check if username/email alr exists 
    // to be done after deciding db 

    res.send({
        message: "SignUp Successful"
    })
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password; 

    // make DB call to check if username and passwords are valid 
    // set cookies here
    // fetch id from db
    const token = jwt.sign({
        id: 1
    }, JWT_SECRET);
    res.cookie("token", token);

    res.send({
        message: "SignIn Successful! Welcome User"
    })
})

// app.get("/", async (req, res) => {
//     res.sendFile(path.join(__dirname, "../../src/index.html"))

// })

app.listen(PORT, () => {
    `HTTP server on PORT: ${PORT}`
});