import React, { useState, useEffect } from 'react';
import '../css/FinanceManagement.css';

const FinanceManagement = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
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
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchFinancialStats(),
                fetchStudents()
            ]);
            setError(null);
        } catch (err) {
            setError('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    const fetchFinancialStats = async () => {
        const response = await fetch('https://clarenest.onrender.com/api/dashboard/admin', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch financial statistics');
        const data = await response.json();
        setFinancialStats(data.data.financialStats);
        setDashboardData(data.data);
    };

    const fetchStudents = async () => {
        const response = await fetch('https://clarenest.onrender.com/api/users?role=student', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data.data.users);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://clarenest.onrender.com/api/fees/record-payment', {
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
            fetchFinancialStats();
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
            const response = await fetch('https://clarenest.onrender.com/api/fees/grant-temporary-access', {
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
        const payments = dashboardData?.financialStats?.paymentHistory || [];
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

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const renderOverview = () => {
        if (!financialStats) return null;
    
        const totalFees = financialStats.totalFees || 0;
        const totalPaid = financialStats.totalPaid || 0;
        const totalPending = financialStats.totalPending || 0;
    
        // null check and default empty array
        const paymentHistory = dashboardData?.financialStats?.paymentHistory || [];
        const paymentTrends = paymentHistory.reduce((acc, payment) => {
            const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + payment.amount;
            return acc;
        }, {});
        return (
            <div className="finance-overview">
                <div className="finance-stats">
                    <div className="finance-stat-card">
                        <h3>Total Revenue</h3>
                        <span className="finance-stat-value">${totalFees.toFixed(2)}</span>
                    </div>
                    <div className="finance-stat-card">
                        <h3>Total Collected</h3>
                        <span className="finance-stat-value">${totalPaid.toFixed(2)}</span>
                    </div>
                    <div className="finance-stat-card">
                        <h3>Outstanding</h3>
                        <span className="finance-stat-value">${totalPending.toFixed(2)}</span>
                    </div>
                </div>

                <div className="finance-trends">
                    <h3>Payment Trends</h3>
                    <div className="finance-chart">
                        <div className="finance-chart-bars">
                            {Object.entries(paymentTrends || {}).map(([month, amount]) => (
                                <div key={month} className="finance-chart-bar">
                                    <div 
                                        className="finance-bar"
                                        style={{ height: `${totalPaid ? ((amount / totalPaid) * 100) : 0}%` }}
                                    />
                                    <span className="finance-month">{month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPayments = () => (
        <div className="finance-payments">
            <div className="finance-actions">
                <button 
                    className="finance-record-btn"
                    onClick={() => {
                        setSelectedStudent(null);
                        setShowModal(true);
                    }}
                >
                    Record Payment
                </button>
            </div>

            <div className="finance-table-container">
                <table className="finance-table">
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
                        {dashboardData?.financialStats?.paymentHistory.map(payment => (
                            <tr key={payment._id}>
                                <td>{payment.student.name}</td>
                                <td>${payment.amount.toFixed(2)}</td>
                                <td>{payment.paymentMethod}</td>
                                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                <td>
                                    <span className={`finance-status ${payment.status}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td>{payment.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderReports = () => {
        const report = generateReport(filterPeriod);
        
        return (
            <div className="finance-reports">
                <div className="finance-filters">
                    <select 
                        value={filterPeriod} 
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        className="finance-period-select"
                    >
                        <option value="all">All Time</option>
                        <option value="daily">Today</option>
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                    </select>
                </div>

                <div className="finance-report-content">
                    <div className="finance-report-summary">
                        <div className="finance-summary-card">
                            <h3>Total Transactions</h3>
                            <span>{report.count}</span>
                        </div>
                        <div className="finance-summary-card">
                            <h3>Total Amount</h3>
                            <span>${report.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="finance-payment-methods">
                            <h3>Payment Methods</h3>
                            {Object.entries(report.byMethod).map(([method, amount]) => (
                                <div key={method} className="finance-method-item">
                                    <span>{method}</span>
                                    <span>${amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="finance-loading">Loading...</div>;
    if (error) return <div className="finance-error">{error}</div>;

    return (
        <div className="finance-mgmt">
            <div className="finance-header">
                <h2>Finance Management</h2>
                <div className="finance-tabs">
                    <button 
                        className={`finance-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`finance-tab ${activeTab === 'payments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        Payments
                    </button>
                    <button 
                        className={`finance-tab ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        Reports
                    </button>
                </div>
            </div>

            <div className="finance-content">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'payments' && renderPayments()}
                {activeTab === 'reports' && renderReports()}
            </div>

            {showModal && (
                <div className="finance-modal-overlay">
                    <div className="finance-modal">
                        <div className="finance-modal-header">
                            <h3>Record Payment</h3>
                            <button 
                                className="finance-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="finance-form">
                            <div className="finance-form-group">
                                <label>Student</label>
                                <select
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        studentId: e.target.value
                                    })}
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

                            <div className="finance-form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        amount: e.target.value
                                    })}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="finance-form-group">
                                <label>Payment Method</label>
                                <select
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        paymentMethod: e.target.value
                                    })}
                                    required
                                >
                                    <option value="cash">Cash</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="finance-form-group">
                                <label>Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        notes: e.target.value
                                    })}
                                    rows="3"
                                />
                            </div>

                            <div className="finance-form-group">
                                <label>Temporary Access (Days)</label>
                                <div className="finance-temp-access">
                                    <input
                                        type="number"
                                        value={formData.temporaryAccessDuration}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            temporaryAccessDuration: e.target.value
                                        })}
                                        min="1"
                                        placeholder="Enter days"
                                    />
                                    <button
                                        type="button" onClick={handleGrantTemporaryAccess}
                                        className="finance-grant-access-btn"
                                    >
                                        Grant Access
                                    </button>
                                </div>
                            </div>

                            <div className="finance-modal-actions">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="finance-cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="finance-submit-btn"
                                >
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {alert.show && (
                <div className={`finance-alert ${alert.type}`}>
                    {alert.message}
                </div>
            )}
        </div>
    );
};

export default FinanceManagement;
                