//  定義 Mongoose 的連線
import mongoose from 'mongoose';
import dotenv from "dotenv-defaults";

dotenv.config();
export default {
    connect: () => {
        dotenv.config();
        if (!process.env.MONGO_URL) {
            console.error("backend/src/db/mongo.js Missing MONGO_URL!!!");
            process.exit(1);
        }
        mongoose
            .connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 1000000, // Defaults to 30000 (30 seconds)
            })
            .then((_) => {
                console.log(`backend/src/db/mongo.js DB connection created on: ${process.env.MONGO_URL}`);
            });

        mongoose.connection.on('error',
            console.error.bind(console, 'backend/src/db/mongo.js connection error!'));
    }
};