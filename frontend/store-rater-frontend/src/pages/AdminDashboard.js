import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        setLoading(true);
        const usersUrl = `/api/admin/users?sortBy=${sortConfig.key}&order=${sortConfig.direction}${roleFilter !== 'ALL' ? `&role=${roleFilter}` : ''}`;

        const [statsRes, usersRes] = await Promise.all([
          axios.get('/api/admin/stats', config),
          axios.get(usersUrl, config),
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);

      } catch (err) {
        setError('Failed to fetch admin data. You may not have permission.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token, sortConfig, roleFilter]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <p style={styles.message}>Loading dashboard...</p>;
  if (error) return <p style={{ ...styles.message, color: '#e74c3c' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Admin Dashboard</h1>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}><h2 style={styles.statValue}>{stats?.userCount || 0}</h2><p style={styles.statLabel}>Total Users</p></div>
        <div style={styles.statCard}><h2 style={styles.statValue}>{stats?.storeCount || 0}</h2><p style={styles.statLabel}>Total Stores</p></div>
        <div style={styles.statCard}><h2 style={styles.statValue}>{stats?.ratingCount || 0}</h2><p style={styles.statLabel}>Total Ratings</p></div>
      </div>

      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Manage Users</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label htmlFor="roleFilter" style={{ fontWeight: 'bold', color: '#2c3e50' }}>Filter by Role:</label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '7px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem' }}
          >
            <option value="ALL">All</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
            <option value="USER">User</option>
          </select>
          <Link to="/admin/add-user" style={styles.button}>
            Add User
          </Link>
          <Link to="/stores" style={styles.button}>
            View Stores
          </Link>
          <Link to="/admin/add-store" style={styles.button}>
            Add New Store
          </Link>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}><button onClick={() => requestSort('id')} style={styles.sortButton}>ID</button></th>
              <th style={styles.th}><button onClick={() => requestSort('name')} style={styles.sortButton}>Name</button></th>
              <th style={styles.th}><button onClick={() => requestSort('email')} style={styles.sortButton}>Email</button></th>
              <th style={styles.th}><button onClick={() => requestSort('role')} style={styles.sortButton}>Role</button></th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>
                  <Link to={`/admin/edit-user/${user.id}`} style={styles.editButton}>Edit</Link>
                </td>
              </tr>
            ))}
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
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '50px' },
    statCard: { backgroundColor: '#ffffff', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' },
    statValue: { fontSize: '2.5rem', color: '#3498db', margin: '0 0 5px 0' },
    statLabel: { fontSize: '1rem', color: '#7f8c8d', margin: '0' },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    sectionTitle: { 
      fontSize: '2rem', 
      color: '#2c3e50', 
      margin: 0
    },
    button: {
      backgroundColor: '#2ecc71',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontWeight: 'bold',
      transition: 'background-color 0.2s',
    },
    tableContainer: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #f2f2f2', color: '#2c3e50' },
    td: { padding: '15px', textAlign: 'left', borderBottom: '1px solid #f2f2f2', color: '#34495e' },
    message: { textAlign: 'center', fontSize: '1.2rem', padding: '50px' },
    sortButton: { border: 'none', backgroundColor: 'transparent', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'bold', cursor: 'pointer', padding: 0, textAlign: 'left' },
    editButton: {
        backgroundColor: '#3498db',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '0.9rem',
    }
};

export default AdminDashboard;

