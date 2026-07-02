import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 8000;
const allowrdOrigins = ["*"]

const app = express();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(cors({
    origin: allowrdOrigins,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// app.get('/redis', async (req, res) => {
//     try{
//         const reply = await redis.ping();
//         res.json({ message: 'Redis is connected',redis: reply });
//     }
//     catch (error) {
//         console.error('Error occurred while fetching data from Redis:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// app.get('/mongo', async (req, res) => {
//     try{
//         const url = process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase';

//         if(mongoose.connection.readyState === 0) {
//             await mongoose.connect(url);
//         }
//         res.json({ message: 'MongoDB is connected', database: mongoose.connection.name });
//     }
//     catch (error) {
//         console.error('Error occurred while fetching data from MongoDB:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server running at port http://localhost:${PORT}/`)
    })
}).catch((err) => {
    console.error("DB connection failed:",err);
    process.exit(1)
});

app.get('/',(req,res) => {
    res.send("Backend is running...");
});


export {app , redis}