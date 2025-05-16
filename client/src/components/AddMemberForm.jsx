import React, { useState } from 'react';

const AddMemberForm = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [joiningDate, setJoiningDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [balance, setBalance] = useState(25000);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      phoneNumber,
      joiningDate,
      balance,
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1rem' }}>Add New Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="joiningDate">Date of Joining</label>
            <input
              type="date"
              id="joiningDate"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="balance">Balance</label>
            <input
              type="number"
              id="balance"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberForm;