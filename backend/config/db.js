import mongoose from "mongoose";


const connectDB = async() => {
    try {
          const connection =  await mongoose.connect(`${process.env.MONGODB_URI}`);
            console.log("DB Connected")
    }
    catch (error) {
        console.error('Error occurred while fetching data from MongoDB:', error);
    }
}

export default connectDB;