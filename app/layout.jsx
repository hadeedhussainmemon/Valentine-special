import './globals.css';

export const metadata = {
    title: 'HeartString 💘',
    description: 'Will you be my Valentine?',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
                <link rel="icon" href="/favicon.png" />
            </head>
            <body>
                <div className="app-container">
                    {/* Add Unicorns Globally if desired, or per page. Let's add them here for the 'app' feel */}
                    <div className="unicorn" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>🦄</div>
                    <div className="unicorn" style={{ top: '60%', left: '80%', animationDelay: '2s' }}>🦄</div>
                    <div className="unicorn" style={{ top: '80%', left: '20%', animationDelay: '4s' }}>🦄</div>
                    {children}
                </div>
            </body>
        </html>
    );
}
