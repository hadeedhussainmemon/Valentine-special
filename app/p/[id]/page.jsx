import { connectDB, Proposal } from '@/lib/mongodb';
import ProposalClient from '@/app/components/ProposalClient';

// Force dynamic rendering since we depend on params
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    await connectDB();
    const { id } = await params;
    const proposal = await Proposal.findOne({ id });

    if (!proposal) {
        return {
            title: 'HeartString 💔',
            description: 'Proposal not found.',
        };
    }

    const title = `${proposal.sender_name} has a question for you... 💌`;
    const description = "Tap to see the surprise! 💘";

    // In Vercel, use VERCEL_URL, otherwise localhost
    // Note: VERCEL_URL does not include https://
    const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

    // Or hardcode your production domain if you have a custom one, 
    // but VERCEL_URL is good for preview deployments too.
    const imageUrl = `${baseUrl}/og-image.png`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
        },
    };
}

export default async function Page({ params }) {
    // Pass the ID to the client component
    const { id } = await params;
    return <ProposalClient id={id} />;
}
