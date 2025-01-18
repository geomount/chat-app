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

app.listen(PORT);