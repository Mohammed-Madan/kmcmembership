import React from 'react';

const Navbar = ({ onAddMemberClick, onLogout, username }) => {
  return (
    <nav style={{ backgroundColor: '#4361ee', padding: '1rem', color: 'white' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>KMC Membership</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {username && (
            <span style={{ fontSize: '0.9rem' }}>
              Welcome, {username}
            </span>
          )}
          
          <button 
            onClick={onAddMemberClick}
            style={{ 
              backgroundColor: 'white', 
              color: '#4361ee',
              fontWeight: 'bold'
            }}
          >
            Add Member
          </button>
          
          <button 
            onClick={onLogout}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid white',
              color: 'white',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;