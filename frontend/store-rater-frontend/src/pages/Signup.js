import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (name.length < 20 || name.length > 60) {
      setError('Name must be between 20 and 60 characters.');
      setLoading(false);
      return;
    }
    if (address && address.length > 400) {
      setError('Address must be 400 characters or less.');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      setLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    if (!passwordRegex.test(password)) {
      setError('Password must be 8-16 characters, include at least one uppercase letter and one special character.');
      setLoading(false);
      return;
    }

    try {
      const newUser = { name, email, password, address };
      await axios.post('/api/auth/register', newUser);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.subtitle}>Join our community of store enthusiasts!</p>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
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
           <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={styles.input}
            />
          </div>
          
          {error && <p style={styles.errorText}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

// --- STYLES (Consistent with Login page) ---
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
    transition: 'border-color 0.3s ease',
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
  }
};

export default Signup;