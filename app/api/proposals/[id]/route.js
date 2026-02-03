import { NextResponse } from 'next/server';
import { connectDB, Proposal } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const proposal = await Proposal.findOne({ id });

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
        }

        return NextResponse.json(proposal);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
