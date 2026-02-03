import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
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
}

// --- SCHEMA DEFINITION ---
// We define it here to ensure it's registered on the connection
const proposalSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    sender_name: { type: String, required: true },
    is_accepted: { type: Boolean, default: false },
    no_hover_count: { type: Number, default: 0 },
    device_type: { type: String },
    mystery_name: { type: String },
    custom_message: { type: String },
    created_at: { type: Date, default: Date.now }
});

// Prevent overwriting model if already compiled
const Proposal = mongoose.models.Proposal || mongoose.model('Proposal', proposalSchema);

export { connectDB, Proposal };
