import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddStorePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState(''); 
  
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/admin/users', config);
        setUsers(data);
      } catch (err) {
        setError('Could not load users for owner selection.');
      }
    };
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setIsSubmitting(true);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const storeData = { name, email, address, ownerId };
      await axios.post('/api/stores', storeData, config);
      
      navigate('/admin');

    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Add a New Store</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Store Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Contact Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="address" style={styles.label}>Address</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="owner" style={styles.label}>Assign Owner (Optional)</label>
            <select id="owner" value={ownerId} onChange={(e) => setOwnerId(e.target.value)} style={styles.input}>
              <option value="">No Owner</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {error && <p style={styles.errorMessage}>{error}</p>}
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Adding Store...' : 'Add Store'}
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
    input: { width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fff' },
    button: { width: '100%', padding: '15px', borderRadius: '5px', border: 'none', backgroundColor: '#2ecc71', color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
    errorMessage: { color: '#e74c3c', textAlign: 'center', marginBottom: '15px' }
};

export default AddStorePage;

