import express from 'express';
import dotenv from 'dotenv';
dotenv.config() 
import videoRoutes from './app/routes/video.route.js';
import cors from 'cors'
import { v2 as Cloudinary } from "cloudinary";
import connectDB from './app/config/db.js';

const app = express();
// console.log('env:',env)

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Error in DB Connection:", err);
    process.exit(1);
});

app.use('/api/',videoRoutes)

export {app}