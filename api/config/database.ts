import mongoose from 'mongoose';
import "dotenv/config";

export const connectDB = async (): Promise<void> => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI is not defined in environment variables.");
        process.exit(1);
    }
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as mongoose.ConnectOptions);
        console.log('MongoDB connected');
    } catch (error: any) {
        console.error("Error connecting to MongoDB:", error.message || error);
        process.exit(1);
    }
};

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    } catch (error: any) {
        console.error("Error disconnecting from MongoDB:", error.message || error);
        process.exit(1);
    }
};

export default { connectDB, disconnectDB };