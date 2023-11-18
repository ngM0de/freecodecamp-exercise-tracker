import mongoose from "mongoose";

export const connectDB = () => {
    return mongoose.connect(process.env.MONGO_URI.replace('<password>', process.env.MONGO_PASSWORD))
}
