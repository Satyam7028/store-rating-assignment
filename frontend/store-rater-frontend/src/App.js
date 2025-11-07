import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StoreList from './pages/StoreList';
import StoreDetail from './pages/StoreDetail';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import SettingsPage from './pages/SettingsPage';
import AddStorePage from './pages/AddStorePage';
import EditUserPage from './pages/EditUserPage'; 
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.navBrand}>StoreRater</Link>
      <div style={styles.navLinks}>
        <Link to="/stores" style={styles.navLink}>Stores</Link>
        {user && user.role === 'ADMIN' && (
          <Link to="/admin" style={styles.navLink}>Admin</Link>
        )}
        {user && user.role === 'OWNER' && (
          <Link to="/owner-dashboard" style={styles.navLink}>My Dashboard</Link>
        )}
        {user ? (
          <>
            <Link to="/settings" style={styles.navLink}>Settings</Link>
            <button onClick={handleLogout} style={styles.navButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/signup" style={styles.navLink}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stores" element={<StoreList />} />
          <Route path="/stores/:id" element={<StoreDetail />} />
          <Route
            path="/admin"
            element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/add-store"
            element={<ProtectedRoute roles={['ADMIN']}><AddStorePage /></ProtectedRoute>}
          />
           {/* 2. Add the ProtectedRoute for the EditUserPage */}
          <Route
            path="/admin/edit-user/:id"
            element={<ProtectedRoute roles={['ADMIN']}><EditUserPage /></ProtectedRoute>}
          />
          <Route
            path="/owner-dashboard"
            element={<ProtectedRoute roles={['OWNER']}><OwnerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute roles={['USER', 'ADMIN', 'OWNER']}><SettingsPage /></ProtectedRoute>}
          />
        </Routes>
      </main>
    </Router>
  );
}

// --- STYLES ---
const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: "'Poppins', sans-serif" },
  navBrand: { fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50', textDecoration: 'none' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  navLink: { color: '#2c3e50', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' },
  navButton: { backgroundColor: 'transparent', border: 'none', color: '#2c3e50', fontSize: '1rem', fontWeight: '500', cursor: 'pointer', padding: '0', fontFamily: "'Poppins', sans-serif" }
};

export default App;

