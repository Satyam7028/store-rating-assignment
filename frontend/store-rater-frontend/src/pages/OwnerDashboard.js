import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOwnerData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const { data } = await axios.get('/api/owner/dashboard', config);
        setDashboardData(data);
      } catch (err) {
        setError('Failed to fetch owner data. You may not be assigned to a store.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOwnerData();
    }
  }, [token]);

  if (loading) return <p style={styles.message}>Loading your dashboard...</p>;
  if (error) return <p style={{ ...styles.message, color: '#e74c3c' }}>{error}</p>;
  
  if (!dashboardData || !dashboardData.store) {
    return <p style={styles.message}>No dashboard data available for your store.</p>;
  }

  const { store, averageRating, raters } = dashboardData;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Owner Dashboard</h1>
      
      <div style={styles.storeHeader}>
        <h2 style={styles.storeName}>{store.name}</h2>
        <p style={styles.storeAddress}>{store.address}</p>
        <div style={styles.ratingInfo}>
          <span style={styles.ratingValue}>
           {parseFloat(averageRating).toFixed(1)}
          </span>
          <span style={styles.ratingCount}>
            Overall Rating
          </span>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Recent Raters</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>User Name</th>
              <th style={styles.th}>Rating Given</th>
            </tr>
          </thead>
          <tbody>
            {raters && raters.length > 0 ? (
              raters.map((rater) => (
                <tr key={rater.user_id}>
                  <td style={styles.td}>{rater.user_id}</td>
                  <td style={styles.td}>{rater.user_name}</td>
                  <td style={styles.td}>{rater.rating_value} ★</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={styles.tdCenter}>Your store has not been rated yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
    container: { maxWidth: '1100px', margin: '40px auto', padding: '0 20px', fontFamily: "'Poppins', sans-serif" },
    mainTitle: { textAlign: 'center', fontSize: '2.5rem', color: '#2c3e50', marginBottom: '40px' },
    storeHeader: { backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', marginBottom: '50px' },
    storeName: { fontSize: '2.5rem', color: '#2c3e50', margin: '0 0 10px 0' },
    storeAddress: { fontSize: '1.1rem', color: '#7f8c8d', margin: '0 0 20px 0' },
    ratingInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
    ratingValue: { fontSize: '2.5rem', fontWeight: 'bold', color: '#3498db' },
    ratingCount: { fontSize: '1rem', color: '#7f8c8d' },
    sectionTitle: { fontSize: '2rem', color: '#2c3e50', marginBottom: '20px' },
    tableContainer: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #f2f2f2', color: '#2c3e50' },
    td: { padding: '15px', textAlign: 'left', borderBottom: '1px solid #f2f2f2', color: '#34495e' },
    tdCenter: { textAlign: 'center' },
    message: { textAlign: 'center', fontSize: '1.2rem', padding: '50px' }
};

export default OwnerDashboard;

