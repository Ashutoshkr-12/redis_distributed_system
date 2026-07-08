import { app } from "./app.js";
import dotenv from 'dotenv';
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import connectDB from './config/db.js';

const env  = dotenv.config(); 
// console.log('env:',env)

const PORT = process.env.PORT;

app.use(cors());

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: ['*'],
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