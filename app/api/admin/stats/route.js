import { NextResponse } from 'next/server';
import { connectDB, Proposal } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();
        const adminPassword = request.headers.get('x-admin-password');
        const correctPassword = process.env.ADMIN_PASSWORD || 'cupid';

        if (adminPassword !== correctPassword) {
            return NextResponse.json({ error: 'Unauthorized: Wrong Password' }, { status: 401 });
        }

        const proposals = await Proposal.find().sort({ created_at: -1 });
        return NextResponse.json(proposals);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
