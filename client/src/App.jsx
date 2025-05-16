import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import MemberList from './components/MemberList';
import AddMemberForm from './components/AddMemberForm';

const App = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);

  // Create a base URL for API calls based on environment
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  console.log("API URL:", baseURL); // For debugging during deployment

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseURL}/members`);
      setMembers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch members: ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (memberData) => {
    try {
      await axios.post(`${baseURL}/members`, memberData);
      fetchMembers();
      setShowAddModal(false);
    } catch (err) {
      setError('Failed to add member: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`${baseURL}/members/${id}`);
        fetchMembers();
      } catch (err) {
        setError('Failed to delete member: ' + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  };

  const handlePayment = async (id, amount) => {
    try {
      await axios.post(`${baseURL}/members/${id}/payment`, { amount });
      fetchMembers();
    } catch (err) {
      setError('Failed to process payment: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <div className="container" style={{ padding: '1rem', paddingBottom: '5rem' }}>
        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>KMC Membership</h1>
          <button onClick={() => setShowAddModal(true)}>Add Member</button>
        </div>
        
        <MemberList
          members={members}
          onDelete={handleDeleteMember}
          onPayment={handlePayment}
          loading={loading}
        />
      </div>

      {showAddModal && (
        <AddMemberForm 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddMember} 
        />
      )}
    </div>
  );
};

export default App;