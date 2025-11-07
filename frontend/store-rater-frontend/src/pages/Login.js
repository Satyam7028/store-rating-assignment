import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

const Login = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.token);
      navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Welcome Back!</h2>
        <p style={styles.subtitle}>Please sign in to your account.</p>
        
        {successMessage && <p style={styles.successText}>{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>
        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Poppins', sans-serif",
  },
  formWrapper: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#3498db',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
  footerText: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#7f8c8d',
  },
  link: {
    color: '#3498db',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '15px',
  },
  successText: {
    color: '#2ecc71', 
    textAlign: 'center',
    marginBottom: '15px',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    padding: '10px',
    borderRadius: '5px',
  }
};

export default Login;

