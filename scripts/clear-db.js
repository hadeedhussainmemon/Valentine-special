import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env');
    process.exit(1);
}

async function clearDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to Database');

        // Access the collection directly to clear it
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            if (collection.collectionName === 'proposals') {
                await collection.deleteMany({});
                console.log('✅ Cleared all proposals history.');
            }
        }

        console.log('Cleanup Complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
}

clearDatabase();
