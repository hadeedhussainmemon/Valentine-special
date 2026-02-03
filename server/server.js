require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { connectDB, Proposal } = require('./database');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// 1. Create Proposal (Sender Name -> Link ID)
app.post('/api/proposals', async (req, res) => {
    const { sender_name, custom_message } = req.body;
    if (!sender_name) {
        return res.status(400).json({ error: 'Sender name is required' });
    }

    const id = uuidv4();
    try {
        const newProposal = await Proposal.create({ id, sender_name, custom_message });
        res.json({ id: newProposal.id, sender_name: newProposal.sender_name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get Proposal Details
app.get('/api/proposals/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const proposal = await Proposal.findOne({ id });
        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }
        res.json(proposal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Update "No" Hover Count
app.post('/api/proposals/:id/interaction', async (req, res) => {
    const { id } = req.params;
    try {
        await Proposal.updateOne({ id }, { $inc: { no_hover_count: 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Accept Proposal
app.post('/api/proposals/:id/accept', async (req, res) => {
    const { id } = req.params;
    const { mystery_name, device_type } = req.body;

    const updateFields = { is_accepted: true };
    if (mystery_name) updateFields.mystery_name = mystery_name;
    if (device_type) updateFields.device_type = device_type;

    try {
        await Proposal.updateOne({ id }, updateFields);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Admin Stats
app.get('/api/admin/stats', async (req, res) => {
    const adminPassword = req.headers['x-admin-password'];
    const correctPassword = process.env.ADMIN_PASSWORD || 'cupid';

    if (adminPassword !== correctPassword) {
        return res.status(401).json({ error: 'Unauthorized: Wrong Password' });
    }

    try {
        const proposals = await Proposal.find().sort({ created_at: -1 });
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve Static Assets in Production
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all to serve React app with Dynamic Meta Tags
app.get('*', async (req, res) => {
    const filePath = path.join(__dirname, '../dist/index.html');

    // Check if it's a proposal link
    const match = req.path.match(/^\/p\/([a-zA-Z0-9-]+)$/);

    if (match) {
        const proposalId = match[1];
        try {
            const proposal = await Proposal.findOne({ id: proposalId });

            if (proposal) {
                // Read index.html and inject meta tags
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        return res.sendFile(filePath);
                    }

                    const title = `${proposal.sender_name} has a question for you... 💌`;
                    const description = "Tap to see the surprise! 💘";
                    const imageUrl = `${req.protocol}://${req.get('host')}/og-image.png`;

                    const result = data
                        .replace('<title>HeartString 💘</title>', `<title>${title}</title>`)
                        .replace('</head>', `
                            <meta property="og:title" content="${title}" />
                            <meta property="og:description" content="${description}" />
                            <meta property="og:image" content="${imageUrl}" />
                            <meta name="twitter:card" content="summary_large_image">
                            </head>`);

                    res.send(result);
                });
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Default Fallback
    res.sendFile(filePath);
});

// Export for Vercel
module.exports = app;

// Only listen if run directly (not required by Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
