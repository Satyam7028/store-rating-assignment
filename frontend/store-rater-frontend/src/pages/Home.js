import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Find & Rate Your Favorite Stores</h1>
        <p style={styles.subtitle}>
          Discover local gems and share your experiences with the community.
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/stores" style={{ ...styles.button, ...styles.buttonPrimary }}>
            Browse Stores
          </Link>
          <Link to="/signup" style={{ ...styles.button, ...styles.buttonSecondary }}>
            Get Started
          </Link>
        </div>
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
    textAlign: 'center',
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Poppins', sans-serif",
  },
  hero: {
    maxWidth: '700px',
  },
  title: {
    fontSize: '3.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
    fontWeight: '600',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#7f8c8d',
    marginBottom: '2.5rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },

  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  buttonPrimary: {
    backgroundColor: '#3498db',
    color: 'white',
    border: '2px solid #3498db',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '2px solid #3498db',
  },
};

export default Home;

