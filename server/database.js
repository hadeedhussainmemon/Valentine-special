require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
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

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = { connectDB, Proposal };
