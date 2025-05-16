import React, { useState } from 'react';
import PaymentForm from './PaymentForm';

const MemberList = ({ members, onDelete, onPayment, loading }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handlePaymentClick = (member) => {
    setSelectedMember(member);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (amount) => {
    onPayment(selectedMember._id, amount);
    setShowPaymentModal(false);
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <div className="member-list">
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Phone Number</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Joining Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actual Balance (TZS)</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                  No members found
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.75rem' }}>{member.name}</td>
                  <td style={{ padding: '0.75rem' }}>{member.phoneNumber}</td>
                  <td style={{ padding: '0.75rem' }}>
                      {(() => {
                        const date = new Date(member.joiningDate);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                      })()}
                    </td>
                  <td style={{ padding: '0.75rem' }}>
                    {member.balance.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handlePaymentClick(member)}
                      style={{ backgroundColor: '#4361ee' }}
                    >
                      Payment
                    </button>
                    <button
                      onClick={() => onDelete(member._id)}
                      style={{ backgroundColor: '#e63946' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPaymentModal && (
        <PaymentForm
          member={selectedMember}
          onSubmit={handlePaymentSubmit}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default MemberList;