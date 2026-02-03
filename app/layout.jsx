import './globals.css';

export const metadata = {
    title: 'Valentine Requests 🧸',
    description: 'A cute way to ask the big question!',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&family=Patrick+Hand&display=swap" rel="stylesheet" />
                <link rel="icon" href="/favicon.png" />
            </head>
            <body>
                <div className="app-container">
                    {children}
                </div>
            </body>
        </html>
    );
}
