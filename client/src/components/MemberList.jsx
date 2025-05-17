import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import MemberCard from './MemberCard';

const MemberList = ({ members, onDelete, onPayment, loading }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showWithBalance, setShowWithBalance] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if device is mobile on component mount and window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePaymentClick = (member) => {
    setSelectedMember(member);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (amount) => {
    onPayment(selectedMember._id, amount);
    setShowPaymentModal(false);
  };

  // Helper function to calculate days until next fee
  const calculateDaysUntilNextFee = (lastFeeDate) => {
    const today = new Date();
    const lastFee = new Date(lastFeeDate);
    
    // Create next fee date (one year after last fee)
    const nextFeeDate = new Date(lastFee);
    nextFeeDate.setFullYear(lastFee.getFullYear() + 1);
    
    // Calculate difference in days
    const diffTime = nextFeeDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  // Sort members alphabetically by name
  const sortedMembers = [...members].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Filter members with balance if filter is active
  const filteredMembers = showWithBalance 
    ? sortedMembers.filter(member => member.balance > 0)
    : sortedMembers;

  return (
    <div className="member-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Members</h1>
        <div className="filter-container">
          <label htmlFor="balance-filter" style={{ marginBottom: 0, marginRight: '8px', display: 'inline-block' }}>
            Show only with balance:
          </label>
          <input
            id="balance-filter"
            type="checkbox"
            checked={showWithBalance}
            onChange={() => setShowWithBalance(!showWithBalance)}
            style={{ width: 'auto', margin: 0 }}
          />
        </div>
      </div>

      {isMobile ? (
        <div className="mobile-member-list">
          {filteredMembers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              No members found
            </div>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard
                key={member._id}
                member={member}
                onDelete={onDelete}
                onPayment={handlePaymentClick}
                daysUntilNextFee={calculateDaysUntilNextFee(member.lastFeeDate)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Phone Number</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Joining Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Last Fee Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Next Fee Due</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actual Balance (TZS)</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const daysUntil = calculateDaysUntilNextFee(member.lastFeeDate);
                  return (
                    <tr key={member._id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '0.75rem' }}>{member.name}</td>
                      <td style={{ padding: '0.75rem' }}>{member.phoneNumber}</td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(member.joiningDate)}</td>
                      <td style={{ padding: '0.75rem' }}>{formatDate(member.lastFeeDate)}</td>
                      <td style={{ 
                          padding: '0.75rem',
                          color: daysUntil <= 30 ? '#e63946' : daysUntil <= 90 ? '#fd7e14' : 'inherit',
                          fontWeight: daysUntil <= 30 ? 'bold' : 'normal'
                        }}>
                        {daysUntil} days
                      </td>
                      <td style={{ 
                          padding: '0.75rem',
                          color: member.balance < 0 ? 'green' : 'inherit',
                          fontWeight: member.balance < 0 ? 'bold' : 'normal' 
                        }}>
                        {member.balance.toLocaleString()}
                        {member.balance < 0 ? ' (Credit)' : ''}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

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