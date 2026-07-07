import { app } from "./app.js";
import dotenv from 'dotenv';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import connectDB from './config/db.js';

// 1. FIX: Correct dotenv syntax (defaults to looking for a '.env' file in the root)
dotenv.config(); 

const PORT = process.env.PORT;
const allowedOrigins = ["*"]; 

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const server = http.createServer(app);

// 3. FIX: Removed the extra brackets around allowedOrigins
export const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST" , 'PUT', 'DELETE']
    }
});

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Error in DB Connection:", err);
    process.exit(1);
});