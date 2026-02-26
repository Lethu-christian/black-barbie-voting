import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'; // Import your new Landing page
import Home from './pages/Home';       // This is your Voting Arena
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ContestantDetails from './pages/ContestantDetails';
import Gallery from './pages/Gallery';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. MAKE LANDING THE DEFAULT PATH ("/") */}
        <Route path="/" element={<Landing />} />

        {/* 2. MOVE THE VOTING ARENA TO "/home" */}
        <Route path="/home" element={<Home />} />

        {/* Other existing routes */}
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/contestant/:id" element={<ContestantDetails />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;