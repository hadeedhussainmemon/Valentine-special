import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const conn = await connectDB();
        const state = conn.connection ? conn.connection.readyState : conn.readyState;
        const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

        return NextResponse.json({
            status: 'ok',
            message: 'Next.js API is running!',
            db_state: stateMap[state] || state,
            env_check: process.env.MONGODB_URI ? 'URI Found' : 'URI Missing'
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Database connection failed',
            error: error.message
        }, { status: 500 });
    }
}
