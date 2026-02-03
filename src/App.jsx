import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePage from './pages/CreatePage';
import ProposalPage from './pages/ProposalPage';
import AdminPage from './pages/AdminPage';
import './index.css';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <Routes>
                    <Route path="/" element={<CreatePage />} />
                    <Route path="/p/:id" element={<ProposalPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
