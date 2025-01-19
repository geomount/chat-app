import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import json, {JwtPayload} from 'jsonwebtoken';

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));

app.get("/", async (req, res) => {
    const username = req.body.username;

    res.send({
        message: "Hi from the HTTP Server"
    })
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

    res.send({
        message: "SignIn Successful! Welcome User"
    })
})

app.listen(PORT, () => {
    `HTTP server on PORT: ${PORT}`
});