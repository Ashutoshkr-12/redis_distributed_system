import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();


const connectDB = async() => {
    try {
        // console.log("Env DB:",process.env.MONGODB_URI)
          const connection =  await mongoose.connect(`${process.env.MONGODB_URI}`);
            console.log("DB Connected")
    }
    catch (error) {
        console.error('Error occurred while fetching data from MongoDB:', error);
    }
}

export default connectDB;