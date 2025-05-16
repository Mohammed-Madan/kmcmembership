import React, { useState, useEffect } from 'react';

const Navbar = ({ onAddMemberClick, onLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if device is mobile on component mount and window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav style={{ backgroundColor: '#4361ee', padding: '1rem', color: 'white' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ 
          fontSize: isMobile ? '1.2rem' : '1.5rem', 
          margin: 0 
        }}>
          KMC Membership
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '0.5rem' : '1rem' 
        }}>
          <button 
            onClick={onAddMemberClick}
            style={{ 
              backgroundColor: 'white', 
              color: '#4361ee',
              fontWeight: 'bold',
              padding: isMobile ? '6px 12px' : '8px 16px',
            }}
          >
            Add
          </button>
          
          <button 
            onClick={onLogout}
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid white',
              color: 'white',
              padding: isMobile ? '6px 12px' : '8px 16px',
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