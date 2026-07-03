import { app } from "./app";
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import connectDB from './config/db.js';

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;
const allowrdOrigins = ["*"]

export const io = new Server(server,{
    cors: {
        origin: [allowrdOrigins],
    }
});

connectDB().then(()=>{
    server.listen(PORT,() => {
        console.log(`Server running on port http://localhost:${PORT}`)
    })
}).catch((err) => {
    console.error("Error in DB Connection")
    process.exit(1)
});