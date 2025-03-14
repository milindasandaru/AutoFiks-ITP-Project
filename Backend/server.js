import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config'
import connectDB from './config/mongodb.js';

// App config
const app = express();
const port = process.env.PORT || 4000
connectDB();

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.get('/', (req, res) => {
    res.send("API Working!")
})

app.listen(port, () => console.log("Server started on Port : ", port))