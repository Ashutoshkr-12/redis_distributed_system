import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import videoRoutes from "./routes/video.route.js"
import router from './routes/video.route.js';

const app = express();

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.send("Backend is running...");
});

//api routes
app.use('/api/',videoRoutes)

export {app}