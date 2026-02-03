import { NextResponse } from 'next/server';
import { connectDB, Proposal } from '@/lib/mongodb';

export async function POST(request, { params }) {
    try {
        await connectDB();
        // Next.js 15: params is a Promise, must be awaited
        const { id } = await params;
        const { mystery_name, device_type } = await request.json();

        const updateFields = { is_accepted: true };
        if (mystery_name) updateFields.mystery_name = mystery_name;
        if (device_type) updateFields.device_type = device_type;

        await Proposal.updateOne({ id }, updateFields);
        return NextResponse.json({ success: true });
    } catch (error) {
        // Graceful handling if JSON is invalid or other errors
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
