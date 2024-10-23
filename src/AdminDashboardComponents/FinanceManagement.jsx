import React, { useState, useEffect } from 'react';
import '../css/FinanceManagement.css';

const FinanceManagement = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    paymentMethod: '',
    notes: ''
  });
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchPayments();
    fetchStudents();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fee-payments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPayments(data.data.payments);
    } catch (error) {
      showAlert('Failed to fetch payments', 'error');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStudents(data.data.students);
    } catch (error) {
      showAlert('Failed to fetch students', 'error');
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      studentId: '',
      amount: '',
      paymentMethod: '',
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/fee-payments/record-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to record payment');

      showAlert('Payment successfully recorded', 'success');
      setOpenDialog(false);
      fetchPayments();
    } catch (error) {
      showAlert('Failed to record payment', 'error');
    }
  };

  const generateFinancialReport = () => {
    const monthlyData = payments.reduce((acc, payment) => {
      const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {});

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));
  };

  const calculateTotalRevenue = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const calculatePendingPayments = () => {
    return students.filter(student => !student.feesPaid).length;
  };

  const showAlert = (message, type) => {
    setAlert({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setAlert({ ...alert, show: false });
    }, 3000);
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${calculateTotalRevenue()}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <p className="stat-value">{calculatePendingPayments()}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Monthly Revenue</h3>
        <div className="bar-chart">
          {generateFinancialReport().map(({ month, amount }) => (
            <div className="bar-group" key={month}>
              <div 
                className="bar" 
                style={{ 
                  height: `${(amount / calculateTotalRevenue()) * 200}px`
                }}
              >
                <span className="bar-value">${amount}</span>
              </div>
              <span className="bar-label">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="payments-section">
      <div className="section-header">
        <button className="add-button" onClick={handleOpenDialog}>
          + Record Payment
        </button>
      </div>

      <div className="table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.student?.name}</td>
                <td className="amount">${payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>{payment.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports-section">
      <div className="chart-container">
        <h3>Payment Statistics</h3>
        <div className="bar-chart large">
          {generateFinancialReport().map(({ month, amount }) => (
            <div className="bar-group" key={month}>
              <div 
                className="bar" 
                style={{ 
                  height: `${(amount / calculateTotalRevenue()) * 300}px`
                }}
              >
                <span className="bar-value">${amount}</span>
              </div>
              <span className="bar-label">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="finance-management">
      <div className="tab-navigation">
        <button 
          className={`tab-button ${currentTab === 'overview' ? 'active' : ''}`}
          onClick={() => setCurrentTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${currentTab === 'payments' ? 'active' : ''}`}
          onClick={() => setCurrentTab('payments')}
        >
          Payments
        </button>
        <button 
          className={`tab-button ${currentTab === 'reports' ? 'active' : ''}`}
          onClick={() => setCurrentTab('reports')}
        >
          Reports
        </button>
      </div>

      <div className="tab-content">
        {currentTab === 'overview' && renderOverview()}
        {currentTab === 'payments' && renderPayments()}
        {currentTab === 'reports' && renderReports()}
      </div>

      {openDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Record New Payment</h3>
              <button 
                className="close-button"
                onClick={() => setOpenDialog(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="studentId">Student</label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {alert.show && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default FinanceManagement;