import express from 'express';
import Redis from 'ioredis';
import videoRoutes from "./routes/video.route.js"
import router from './routes/video.route.js';

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

//api routes
app.use('/api/',videoRoutes)

export {app}