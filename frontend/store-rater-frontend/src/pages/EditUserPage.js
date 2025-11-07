import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const EditUserPage = () => {
  const { id } = useParams(); 
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`/api/admin/users/${id}`, config);
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
      } catch (err) {
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/admin/users/${id}`, { role }, config);
      setMessage('User role updated successfully!');
      
      setTimeout(() => navigate('/admin'), 1500);

    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  if (loading) return <p style={{textAlign: 'center', fontSize: '1.2rem', padding: '50px'}}>Loading user...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Edit User</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input type="text" value={name} style={styles.input} readOnly />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} style={styles.input} readOnly />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="role" style={styles.label}>Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          {error && <p style={styles.errorMessage}>{error}</p>}
          {message && <p style={styles.successMessage}>{message}</p>}
          <button type="submit" style={styles.button}>
            Update Role
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
    title: { textAlign: 'center', fontSize: '2.5rem', color: '#2c3e50', marginBottom: '30px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '5px', color: '#34495e', fontWeight: '500' },
    input: { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#f8f9fa' },
    button: { width: '100%', padding: '15px', borderRadius: '5px', border: 'none', backgroundColor: '#3498db', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
    errorMessage: { color: '#e74c3c', textAlign: 'center', marginBottom: '15px' },
    successMessage: { color: '#2ecc71', textAlign: 'center', marginBottom: '15px' }
};

export default EditUserPage;
