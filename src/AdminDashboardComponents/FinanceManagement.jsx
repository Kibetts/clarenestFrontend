import React, { useState, useEffect } from 'react';
import '../css/FinanceManagement.css';

const FinanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentMethod: 'cash',
    notes: '',
    temporaryAccessDuration: ''
  });
  const [financialStats, setFinancialStats] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchFinancialStats(),
        fetchStudents(),
        fetchPayments()
      ]);
      setError(null);
    } catch (err) {
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancialStats = async () => {
    const response = await fetch('http://localhost:5000/api/dashboard/admin', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch financial statistics');
    const data = await response.json();
    setFinancialStats(data.data.financialStats);
  };

  const fetchStudents = async () => {
    const response = await fetch('http://localhost:5000/api/students', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    const data = await response.json();
    setStudents(data.data.students);
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fee-payment/payment-history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data.data.payments || []); // Ensure we always have an array
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]); // Set empty array on error
    }
  };

  const handleShowModal = (student = null) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student ? student._id : '',
      amount: '',
      paymentMethod: 'cash',
      notes: '',
      temporaryAccessDuration: ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.studentId || !formData.amount || !formData.paymentMethod) {
      showAlert('Please fill in all required fields', 'error');
      return false;
    }
    if (parseFloat(formData.amount) <= 0) {
      showAlert('Amount must be greater than 0', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/fee-payment/record-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId: formData.studentId,
          amount: parseFloat(formData.amount),
          paymentMethod: formData.paymentMethod,
          notes: formData.notes
        })
      });

      if (!response.ok) throw new Error('Failed to record payment');
      
      showAlert('Payment recorded successfully', 'success');
      setShowModal(false);
      fetchInitialData();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const handleGrantTemporaryAccess = async () => {
    if (!formData.studentId || !formData.temporaryAccessDuration) {
      showAlert('Please specify student and duration', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/fee-payment/grant-temporary-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          studentId: formData.studentId,
          durationInDays: parseInt(formData.temporaryAccessDuration)
        })
      });

      if (!response.ok) throw new Error('Failed to grant temporary access');
      
      showAlert('Temporary access granted successfully', 'success');
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      showAlert(err.message, 'error');
    }
  };

  const generateReport = (period = 'all') => {
    let filteredPayments = [...payments];
    const now = new Date();
    
    switch(period) {
      case 'daily':
        filteredPayments = payments.filter(payment => 
          new Date(payment.paymentDate).toDateString() === now.toDateString()
        );
        break;
      case 'weekly':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filteredPayments = payments.filter(payment => 
          new Date(payment.paymentDate) >= weekAgo
        );
        break;
      case 'monthly':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filteredPayments = payments.filter(payment => 
          new Date(payment.paymentDate) >= monthAgo
        );
        break;
      default:
        break;
    }

    return {
      totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
      count: filteredPayments.length,
      byMethod: filteredPayments.reduce((acc, payment) => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
        return acc;
      }, {})
    };
  };

  const renderOverview = () => {
    if (!financialStats) return <div>Loading financial statistics...</div>;
    if (!payments || !Array.isArray(payments)) return <div>Loading payments data...</div>;
  
    // Add null checks and default values
    const totalFees = financialStats.totalFees || 0;
    const totalPaid = financialStats.totalPaid || 0;
    const totalPending = financialStats.totalPending || 0;
  
    // Calculate payment trends
    const paymentTrends = payments.reduce((acc, payment) => {
      const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + (payment.amount || 0);
      return acc;
    }, {});
  
    return (
      <div className="overview-section">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <span className="stat-value">${totalFees.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <h3>Total Collected</h3>
            <span className="stat-value">${totalPaid.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <h3>Outstanding</h3>
            <span className="stat-value">${totalPending.toFixed(2)}</span>
          </div>
        </div>
  
        <div className="payment-trends">
          <h3>Payment Trends</h3>
          <div className="trend-chart">
            <div className="chart-bars">
              {Object.entries(paymentTrends).map(([month, amount]) => (
                <div key={month} className="chart-bar">
                  <div 
                    className="bar"
                    style={{ height: `${totalPaid ? ((amount / totalPaid) * 100) : 0}%` }}
                  />
                  <span className="month">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderPayments = () => (
    <div className="payments-section">
      <div className="table-actions">
      <button 
            className="record-payment"
            onClick={() => handleShowModal()}
          >
            Record Payment
          </button>
      </div>

      <table className="payments-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Date</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment._id}>
              <td>{payment.student.name}</td>
              <td>${payment.amount.toFixed(2)}</td>
              <td>{payment.paymentMethod}</td>
              <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
              <td>
                <span className={`status ${payment.status}`}>
                  {payment.status}
                </span>
              </td>
              <td>{payment.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );


  const renderPaymentModal = () => (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>
            {selectedStudent 
              ? `Record Payment for ${selectedStudent.name}`
              : 'Record Payment'}
          </h3>
          <button 
            className="close-button"
            onClick={() => setShowModal(false)}
          >
            ×
          </button>
        </div>
  
        {selectedStudent && (
          <div className="student-details">
            <p>Grade: {selectedStudent.grade}</p>
            <p>Total Fees: ${selectedStudent.totalFees?.toFixed(2) || '0.00'}</p>
            <p>Paid Fees: ${selectedStudent.paidFees?.toFixed(2) || '0.00'}</p>
            <p>Pending: ${((selectedStudent.totalFees || 0) - (selectedStudent.paidFees || 0)).toFixed(2)}</p>
          </div>
        )}
  
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
  
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>
  
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
  
          <div className="form-group">
            <label>Temporary Access (Days)</label>
            <div className="temporary-access">
              <input
                type="number"
                name="temporaryAccessDuration"
                value={formData.temporaryAccessDuration}
                onChange={handleInputChange}
                min="1"
                placeholder="Enter days"
              />
              <button
                type="button"
                onClick={handleGrantTemporaryAccess}
                className="grant-access"
              >
                Grant Access
              </button>
            </div>
          </div>
  
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit">
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports-section">
      <div className="report-filters">
        <select 
          value={filterPeriod} 
          onChange={(e) => setFilterPeriod(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="daily">Today</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
        </select>
      </div>

      <div className="report-content">
        {(() => {
          const report = generateReport(filterPeriod);
          return (
            <div className="report-summary">
              <div className="summary-card">
                <h3>Total Transactions</h3>
                <span>{report.count}</span>
              </div>
              <div className="summary-card">
                <h3>Total Amount</h3>
                <span>${report.totalAmount.toFixed(2)}</span>
              </div>
              <div className="payment-methods">
                <h3>Payment Methods</h3>
                {Object.entries(report.byMethod).map(([method, amount]) => (
                  <div key={method} className="method-item">
                    <span>{method}</span>
                    <span>${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="finance-management">
      <div className="header">
        <h2>Finance Management</h2>
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </div>

      <div className="content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {showModal && renderPaymentModal()}

      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;