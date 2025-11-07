import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
    }

    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        '/api/auth/updatepassword',
        { currentPassword, newPassword },
        config
      );
      
      setMessage(data.msg);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Settings</h1>
        <h2 style={styles.subtitle}>Change Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="currentPassword" style={styles.label}>Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="newPassword" style={styles.label}>New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          {error && <p style={styles.errorMessage}>{error}</p>}
          {message && <p style={styles.successMessage}>{message}</p>}
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
    container: { maxWidth: '600px', margin: '50px auto', padding: '0 20px', fontFamily: "'Poppins', sans-serif" },
    formContainer: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
    title: { textAlign: 'center', fontSize: '2.5rem', color: '#2c3e50', marginBottom: '10px' },
    subtitle: { textAlign: 'center', fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '30px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: '500' },
    input: { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' },
    button: { width: '100%', padding: '15px', borderRadius: '5px', border: 'none', backgroundColor: '#3498db', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
    errorMessage: { color: '#e74c3c', textAlign: 'center', marginBottom: '15px' },
    successMessage: { color: '#2ecc71', textAlign: 'center', marginBottom: '15px' }
};

export default SettingsPage;
