import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#4361ee', padding: '1rem', color: 'white' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>KMC Membership</h1>
      </div>
    </nav>
  );
};

export default Navbar;