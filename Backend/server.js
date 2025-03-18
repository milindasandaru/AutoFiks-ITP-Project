import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config'
import connectDB from './config/mongodb.js';
import employeeRoutes from './routes/employeeRoutes.js';

// App config
const app = express();
const port = process.env.PORT || 4000
connectDB();

// middlewares
app.use(express.json())
app.use(cors())
app.use("/api/employees", employeeRoutes);

// api endpoints
app.get('/', (req, res) => {
    res.send("API Working!")
})

app.listen(port, () => console.log("Server started on Port : ", port))