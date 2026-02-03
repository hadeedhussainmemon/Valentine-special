import { NextResponse } from 'next/server';
import { connectDB, Proposal } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        await connectDB();
        const { sender_name, custom_message } = await request.json();

        if (!sender_name) {
            return NextResponse.json({ error: 'Sender name is required' }, { status: 400 });
        }

        const id = uuidv4();
        const newProposal = await Proposal.create({ id, sender_name, custom_message });

        return NextResponse.json({ id: newProposal.id, sender_name: newProposal.sender_name });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
