import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disable Mongoose buffering
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

// Define Schema
const proposalSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping our UUID as 'id' for URL consistency
    sender_name: { type: String, required: true },
    is_accepted: { type: Boolean, default: false },
    no_hover_count: { type: Number, default: 0 },
    device_type: { type: String },
    mystery_name: { type: String },
    custom_message: { type: String },
    created_at: { type: Date, default: Date.now }
});

export const Proposal = mongoose.models.Proposal || mongoose.model('Proposal', proposalSchema);
