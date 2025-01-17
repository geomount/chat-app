import express from 'express';
const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
    const username = req.body.username;

    res.send({
        message: "Hi from the HTTP Server"
    })
})

app.listen(PORT);