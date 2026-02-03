const mongoose = require('mongoose');

// Your URI from .env
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("❌ MONGODB_URI is missing!");
    process.exit(1);
}

console.log("Attempting connection to MongoDB...");

mongoose.connect(uri)
    .then(() => {
        console.log("✅ Successfully connected to MongoDB!");
        console.log("This means your password and AllowList are correct.");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Connection Failed:", err.message);
        console.log("Possible causes:");
        console.log("1. Password is wrong (check special characters).");
        console.log("2. IP whitelist blocks Render (Go to Atlas > Network Access > Add 0.0.0.0/0).");
        process.exit(1);
    });
