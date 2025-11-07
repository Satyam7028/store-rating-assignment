import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Rating from '../components/Rating';

const StoreDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuth(); 
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  const isOwner = user && store && user.id === store.owner_id;

  const fetchStore = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/stores/${id}`);
      setStore(res.data);
    } catch (err) {
      setError('Could not fetch store details. The store may not exist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, [id]);
  
  const handleRatingSubmit = async () => {
    if (newRating === 0) {
      setRatingError('Please select a rating from 1 to 5 stars.');
      return;
    }
    
    setIsSubmitting(true);
    setRatingError('');
    setRatingSuccess('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      try {
        await axios.put(`/api/stores/${id}/ratings`, { rating_value: newRating }, config);
        setRatingSuccess('Your rating has been updated successfully!');
      } catch (err) {
         await axios.post(`/api/stores/${id}/ratings`, { rating_value: newRating }, config);
         setRatingSuccess('Thank you for your rating!');
      }

      await fetchStore();
      setNewRating(0);

    } catch (err) {
      setRatingError(err.response?.data?.msg || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p style={styles.message}>Loading store details...</p>;
  if (error) return <p style={{ ...styles.message, color: '#e74c3c' }}>{error}</p>;
  if (!store) return <p style={styles.message}>Store not found.</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.storeName}>{store.name}</h1>
        <p style={styles.storeAddress}>{store.address}</p>
        <div style={styles.ratingInfo}>
          <span style={styles.ratingValue}>
            ⭐ {parseFloat(store.averageRating).toFixed(1)}
          </span>
          <span style={styles.ratingCount}>
            ({store.ratingCount} ratings)
          </span>
        </div>
      </div>

      <div style={styles.ratingSection}>
        <h2 style={styles.sectionTitle}>Your Rating</h2>
        
        {isOwner ? (
          <p style={styles.ownerMessage}>You are the owner of this store and cannot rate it.</p>
        ) : token ? (
          <div style={styles.interactiveRatingSection}>
            <Rating value={newRating} onChange={setNewRating} />
            <button 
              style={styles.button} 
              onClick={handleRatingSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
            {ratingError && <p style={styles.errorMessage}>{ratingError}</p>}
            {ratingSuccess && <p style={styles.successMessage}>{ratingSuccess}</p>}
          </div>
        ) : (
          <p style={styles.loginPrompt}>
            <Link to="/login" style={styles.loginLink}>Log in</Link> to rate this store.
          </p>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: "'Poppins', sans-serif" },
  header: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', textAlign: 'center', marginBottom: '40px' },
  storeName: { fontSize: '3rem', color: '#2c3e50', margin: '0 0 10px 0' },
  storeAddress: { fontSize: '1.2rem', color: '#7f8c8d', margin: '0 0 20px 0' },
  ratingInfo: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  ratingValue: { fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' },
  ratingCount: { fontSize: '1rem', color: '#7f8c8d' },
  ratingSection: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' },
  sectionTitle: { textAlign: 'center', fontSize: '1.8rem', color: '#2c3e50', marginBottom: '30px' },
  interactiveRatingSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  button: { backgroundColor: '#3498db', color: 'white', border: 'none', padding: '12px 24px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' },
  loginPrompt: { textAlign: 'center', fontSize: '1.1rem', color: '#7f8c8d' },
  loginLink: { color: '#3498db', fontWeight: 'bold', textDecoration: 'none' },
  errorMessage: { color: '#e74c3c', textAlign: 'center' },
  successMessage: { color: '#2ecc71', textAlign: 'center' },
  message: { textAlign: 'center', fontSize: '1.2rem', padding: '50px' },
 
  ownerMessage: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#7f8c8d',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
  }
};

export default StoreDetail;

