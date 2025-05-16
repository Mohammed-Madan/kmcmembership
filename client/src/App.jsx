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
      
      // Process members to add annual fees
      const processedMembers = data.map(member => {
        const joinDate = new Date(member.joiningDate);
        const today = new Date();
        
        // Calculate complete years since joining
        let yearDiff = today.getFullYear() - joinDate.getFullYear();
        
        // Adjust year difference if we haven't reached the anniversary date yet
        if (
          today.getMonth() < joinDate.getMonth() || 
          (today.getMonth() === joinDate.getMonth() && today.getDate() < joinDate.getDate())
        ) {
          yearDiff--;
        }
        
        // Make sure we don't count negative years (for future join dates)
        yearDiff = Math.max(0, yearDiff);
        
        // Calculate what the total balance should be based on years passed
        // Initial fee of 25000 + 25000 for each completed year after joining
        const expectedBalance = 25000 * (yearDiff + 1);
        
        // Server might already calculate this, but we're doing it client-side to ensure it's correct
        return {
          ...member,
          yearsActive: yearDiff,
          expectedBalance: expectedBalance
        };
      });
      
      setMembers(processedMembers);
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
    
    // Set up an interval to check for annual fees every day
    // In a production app, this would be better handled by the server
    const intervalId = setInterval(() => {
      fetchMembers();
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    return () => clearInterval(intervalId);
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
      <Navbar onAddMemberClick={() => setShowAddModal(true)} />
      <div className="container" style={{ padding: '1rem', paddingBottom: '5rem' }}>
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '0.75rem', 
            marginBottom: '1rem', 
            borderRadius: '4px' 
          }}>
            {error}
            <button 
              onClick={() => setError(null)} 
              style={{ 
                float: 'right', 
                background: 'none', 
                border: 'none', 
                color: '#721c24', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
            >
              ×
            </button>
          </div>
        )}
        
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