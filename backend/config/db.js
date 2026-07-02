import mongoose from "mongoose";


const connectDB = async() => {
    try {
        const url = 'mongodb://localhost:27017/mydatabase';

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(url);
            console.log("DB Connected")
        }
    }
    catch (error) {
        console.error('Error occurred while fetching data from MongoDB:', error);
    }
}

export default connectDB;