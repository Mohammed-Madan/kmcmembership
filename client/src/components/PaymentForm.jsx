import React, { useState } from 'react';

const PaymentForm = ({ member, onSubmit, onClose }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate payment amount
    const paymentAmount = Number(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    
    // Make sure payment isn't greater than current balance
    if (paymentAmount > member.balance) {
      alert('Payment amount cannot exceed current balance');
      return;
    }
    
    onSubmit(amount);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1rem' }}>Payment for {member.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={member.name}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="currentBalance">Current Balance</label>
            <input
              type="text"
              id="currentBalance"
              value={`${member.balance.toLocaleString()} TZS`}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Payment Amount (TZS)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              max={member.balance}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit">Make Payment</button>
            <button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;