import React from 'react';

const MemberCard = ({ member, onDelete, onPayment }) => {
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Add styling for negative balance
  const balanceStyle = member.balance < 0 
    ? { color: 'green', fontWeight: 'bold' } 
    : {};

  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{member.name}</h3>
      
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontWeight: '500' }}>Phone:</span>
          <span>{member.phoneNumber}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontWeight: '500' }}>Joined:</span>
          <span>{formatDate(member.joiningDate)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontWeight: '500' }}>Balance:</span>
          <span style={balanceStyle}>
            {member.balance.toLocaleString()} TZS
            {member.balance < 0 ? ' (Credit)' : ''}
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={() => onPayment(member)}
          style={{ backgroundColor: '#4361ee', flex: 1 }}
        >
          Payment
        </button>
        <button
          onClick={() => onDelete(member._id)}
          style={{ backgroundColor: '#e63946', flex: 1 }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MemberCard;