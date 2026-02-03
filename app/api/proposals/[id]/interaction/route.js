import { NextResponse } from 'next/server';
import { connectDB, Proposal } from '@/lib/mongodb';

export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        await Proposal.updateOne({ id }, { $inc: { no_hover_count: 1 } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
