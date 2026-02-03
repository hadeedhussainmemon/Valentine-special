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

        // Create a URL-friendly slug from the name
        const slug = sender_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
            .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

        // Append a short random string to ensure uniqueness (6 chars is enough)
        const shortId = uuidv4().slice(0, 6);
        const id = `${slug}-${shortId}`;

        const newProposal = await Proposal.create({ id, sender_name, custom_message });

        return NextResponse.json({ id: newProposal.id, sender_name: newProposal.sender_name });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
