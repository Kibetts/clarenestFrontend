import React, { useState, useEffect } from "react";
import "../css/FinanceManagement.css";
import { GRADE_FEES } from "../config/constants";

const FinanceManagement = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        paymentMethod: 'cash',
        notes: ''
    });
    const [financialStats, setFinancialStats] = useState({
        totalFees: 0,
        totalPaid: 0,
        totalPending: 0,
        paymentHistory: []
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [activeTab, setActiveTab] = useState('overview');
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [students, setStudents] = useState([]);
    const [tempAccessFormData, setTempAccessFormData] = useState({
        studentId: '',
        duration: ''
    });

    useEffect(() => {
        fetchInitialData();
        const interval = setInterval(fetchInitialData, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [dashboardResponse, studentsResponse, paymentsResponse] = await Promise.all([
                fetch('http://localhost:5000/api/dashboard/admin', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch('http://localhost:5000/api/users?role=student', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/fee-payment/payments', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);

            if (!dashboardResponse.ok || !studentsResponse.ok || !paymentsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const dashboardData = await dashboardResponse.json();
            const studentsData = await studentsResponse.json();
            const paymentsData = await paymentsResponse.json();

            // Calculate financial statistics
            const stats = studentsData.data.users.reduce((acc, student) => {
                acc.totalFees += GRADE_FEES[student.grade] || 0;
                acc.totalPaid += student.paidFees || 0;
                return acc;
            }, { totalFees: 0, totalPaid: 0 });

            const processedStats = {
                totalFees: stats.totalFees,
                totalPaid: stats.totalPaid,
                totalPending: stats.totalFees - stats.totalPaid,
                paymentHistory: paymentsData.data.payments || []
            };

            setDashboardData({ ...dashboardData.data, financialStats: processedStats });
            setFinancialStats(processedStats);
            setStudents(studentsData.data.users);
            setError(null);

        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const student = students.find(s => s._id === formData.studentId);
            if (!student) {
                throw new Error('Student not found');
            }

            const paymentAmount = parseFloat(formData.amount);
            if (isNaN(paymentAmount) || paymentAmount <= 0) {
                throw new Error('Please enter a valid payment amount');
            }

            const response = await fetch('http://localhost:5000/api/fee-payment/record-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    studentId: formData.studentId,
                    amount: paymentAmount,
                    paymentMethod: formData.paymentMethod,
                    notes: formData.notes
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to record payment');
            }
            
            await fetchInitialData();
            showAlert('Payment recorded successfully', 'success');
            setShowModal(false);
            setFormData({
                studentId: '',
                amount: '',
                paymentMethod: 'cash',
                notes: ''
            });
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const handleGrantTemporaryAccess = async (studentId, duration) => {
        try {
            const response = await fetch('http://localhost:5000/api/fee-payment/grant-temporary-access', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    studentId,
                    durationInDays: parseInt(duration)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to grant temporary access');
            }

            await fetchInitialData();
            showAlert('Temporary access granted successfully', 'success');
            setTempAccessFormData({ studentId: '', duration: '' });
        } catch (err) {
            showAlert(err.message, 'error');
        }
    };

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const renderOverview = () => {
        if (!financialStats) return null;

        // Calculate payment trends
        const trends = financialStats.paymentHistory.reduce((acc, payment) => {
            const month = new Date(payment.paymentDate).toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month] += payment.amount;
            return acc;
        }, {});

        const trendData = Object.entries(trends).map(([month, amount]) => ({
            month,
            amount
        })).slice(-6);  // Last 6 months

        return (
            <div className="finance-overview">
                <div className="finance-stats">
                    <div className="finance-stat-card">
                        <h3>Total Revenue</h3>
                        <span className="finance-stat-value">
                            ${financialStats.totalFees.toFixed(2)}
                        </span>
                    </div>
                    <div className="finance-stat-card">
                        <h3>Total Collected</h3>
                        <span className="finance-stat-value">
                            ${financialStats.totalPaid.toFixed(2)}
                        </span>
                    </div>
                    <div className="finance-stat-card">
                        <h3>Outstanding</h3>
                        <span className="finance-stat-value">
                            ${financialStats.totalPending.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="finance-trends">
                    <h3>Payment Trends</h3>
                    <div className="finance-chart">
                        <div className="finance-chart-bars">
                            {trendData.map(({ month, amount }) => (
                                <div key={month} className="finance-chart-bar">
                                    <div 
                                        className="finance-bar"
                                        style={{ 
                                            height: `${(amount / Math.max(...trendData.map(t => t.amount))) * 100}%`
                                        }}
                                    />
                                    <span className="finance-month">{month}</span>
                                    <span className="finance-amount">${amount.toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPayments = () => {
        const payments = financialStats.paymentHistory || [];
        
        return (
            <div className="finance-payments">
                <div className="finance-actions">
                    <button 
                        className="finance-record-btn"
                        onClick={() => setShowModal(true)}
                    >
                        Record Payment
                    </button>
                </div>

                <div className="finance-table-container">
                    <table className="finance-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Grade</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => {
                                const student = students.find(s => s._id === payment.student);
                                return (
                                    <tr key={payment._id}>
                                        <td>{student?.name || 'Unknown'}</td>
                                        <td>{student?.grade || 'N/A'}</td>
                                        <td>${payment.amount.toFixed(2)}</td>
                                        <td>{payment.paymentMethod}</td>
                                        <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`finance-status ${payment.status || 'completed'}`}>
                                                {payment.status || 'completed'}
                                            </span>
                                        </td>
                                        <td>{payment.notes}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // const renderTemporaryAccess = () => {
    //     const unpaidStudents = students.filter(student => 
    //         student.feeStatus !== 'paid'
    //     );

    //     return (
    //         <div className="finance-temp-access-section">
    //             <div className="student-fee-stats">
    //                 <div className="student-fee-card">
    //                     <h4>Students with Unpaid Fees</h4>
    //                     <span className="student-fee-value">{unpaidStudents.length}</span>
    //                 </div>
    //                 <div className="student-fee-card">
    //                     <h4>Active Temporary Access</h4>
    //                     <span className="student-fee-value">
    //                         {unpaidStudents.filter(student => 
    //                             student.temporaryAccess?.granted && 
    //                             new Date(student.temporaryAccess.expiresAt) > new Date()
    //                         ).length}
    //                     </span>
    //                 </div>
    //             </div>

    //             <div className="finance-table-container">
    //                 <table className="finance-table">
    //                     <thead>
    //                         <tr>
    //                             <th>Student Name</th>
    //                             <th>Grade</th>
    //                             <th>Fee Status</th>
    //                             <th>Outstanding Amount</th>
    //                             <th>Temporary Access Status</th>
    //                             <th>Actions</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {unpaidStudents.map(student => {
    //                             const totalFees = GRADE_FEES[student.grade];
    //                             const paidFees = student.paidFees || 0;
    //                             const outstanding = totalFees - paidFees;
                                
    //                             return (
    //                                 <tr key={student._id}>
    //                                     <td>{student.name}</td>
    //                                     <td>{student.grade}</td>
    //                                     <td>
    //                                         <span className={`finance-status ${student.feeStatus}`}>
    //                                             {student.feeStatus}
    //                                         </span>
    //                                     </td>
    //                                     <td>${outstanding.toFixed(2)}</td>
    //                                     <td>
    //                                         {student.temporaryAccess?.granted && 
    //                                          new Date(student.temporaryAccess.expiresAt) > new Date() ? (
    //                                             <span className="temp-access-status active">
    //                                                 Active until {new Date(student.temporaryAccess.expiresAt).toLocaleDateString()}
    //                                             </span>
    //                                         ) : (
    //                                             <span className="temp-access-status inactive">
    //                                                 No Active Access
    //                                             </span>
    //                                         )}
    //                                     </td>
    //                                     <td>
    //                                         <div className="temp-access-controls">
    //                                             <input
    //                                                 type="number"
    //                                                 min="1"
    //                                                 placeholder="Days"
    //                                                 className="temp-access-input"
    //                                                 value={tempAccessFormData.studentId === student._id ? 
    //                                                     tempAccessFormData.duration : ''}
    //                                                 onChange={(e) => setTempAccessFormData({
    //                                                     studentId: student._id,
    //                                                     duration: e.target.value
    //                                                 })}
    //                                             />
    //                                             <button
    //                                                 onClick={() => handleGrantTemporaryAccess(
    //                                                     student._id,
    //                                                     tempAccessFormData.duration
    //                                                 )}
    //                                                 className="temp-access-grant-btn"
    //                                                 disabled={tempAccessFormData.studentId !== student._id || 
    //                                                          !tempAccessFormData.duration}
    //                                             >
    //                                                 Grant Access
    //                                             </button>
    //                                         </div>
    //                                     </td>
    //                                 </tr>
    //                             );
    //                         })}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         </div>
    //     );
    // };

    const renderTemporaryAccess = () => {
        console.log('All students:', students); // For debugging
    
        const unpaidStudents = students.filter(student => {
            const totalFees = GRADE_FEES[student.grade] || 0;
            const paidFees = student.paidFees || 0;
            return paidFees < totalFees;
        });
    
        console.log('Unpaid students:', unpaidStudents); // For debugging
    
        return (
            <div className="temp-access-section">
                <div className="temp-access-summary">
                    <div className="temp-access-summary-card">
                        <h4>Students with Unpaid Fees</h4>
                        <span className="temp-access-summary-value">{unpaidStudents.length}</span>
                    </div>
                    <div className="temp-access-summary-card">
                        <h4>Active Temporary Access</h4>
                        <span className="temp-access-summary-value">
                            {unpaidStudents.filter(student => 
                                student.temporaryAccess?.granted && 
                                new Date(student.temporaryAccess.expiresAt) > new Date()
                            ).length}
                        </span>
                    </div>
                </div>
    
                <div className="temp-access-table-wrapper">
                    <table className="temp-access-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Fee Status</th>
                                <th>Outstanding Amount</th>
                                <th>Temporary Access Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {unpaidStudents.length > 0 ? (
                                unpaidStudents.map(student => {
                                    const totalFees = GRADE_FEES[student.grade] || 0;
                                    const paidFees = student.paidFees || 0;
                                    const outstanding = totalFees - paidFees;
                                    const hasActiveAccess = student.temporaryAccess?.granted && 
                                        new Date(student.temporaryAccess.expiresAt) > new Date();
    
                                    return (
                                        <tr key={student._id}>
                                            <td>{student.name}</td>
                                            <td>
                                                <span className={`fee-status-badge ${student.feeStatus}`}>
                                                    {student.feeStatus || 'pending'}
                                                </span>
                                            </td>
                                            <td>${outstanding.toFixed(2)}</td>
                                            <td>
                                                <span className={`access-status-badge ${hasActiveAccess ? 'active' : 'inactive'}`}>
                                                    {hasActiveAccess ? 
                                                        `Active until ${new Date(student.temporaryAccess.expiresAt).toLocaleDateString()}` : 
                                                        'No Active Access'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="access-grant-controls">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        placeholder="Days"
                                                        className="access-days-input"
                                                        value={tempAccessFormData.studentId === student._id ? 
                                                            tempAccessFormData.duration : ''}
                                                        onChange={(e) => setTempAccessFormData({
                                                            studentId: student._id,
                                                            duration: e.target.value
                                                        })}
                                                    />
                                                    <button
                                                        onClick={() => handleGrantTemporaryAccess(
                                                            student._id,
                                                            tempAccessFormData.duration
                                                        )}
                                                        className="access-grant-button"
                                                        disabled={tempAccessFormData.studentId !== student._id || 
                                                                 !tempAccessFormData.duration}
                                                    >
                                                        Grant Access
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="no-students-message">
                                        No students with unpaid fees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    const renderReports = () => {
        const generateReport = () => {
            const payments = financialStats.paymentHistory || [];
            let filteredPayments = [...payments];
            const now = new Date();

            switch(filterPeriod) {
                case 'daily':
                    filteredPayments = payments.filter(payment => 
                        new Date(payment.paymentDate).toDateString() === now.toDateString()
                    );
                    break;
                    case 'weekly':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        filteredPayments = payments.filter(payment => 
                            new Date(payment.paymentDate) >= weekAgo
                        );
                        break;
                    case 'monthly':
                        filteredPayments = payments.filter(payment => 
                            new Date(payment.paymentDate).getMonth() === now.getMonth() &&
                            new Date(payment.paymentDate).getFullYear() === now.getFullYear()
                        );
                        break;
                    default:
                        break;
                }
    
                // Calculate payment methods breakdown
                const paymentMethods = filteredPayments.reduce((acc, payment) => {
                    if (!acc[payment.paymentMethod]) {
                        acc[payment.paymentMethod] = { amount: 0, count: 0 };
                    }
                    acc[payment.paymentMethod].amount += payment.amount;
                    acc[payment.paymentMethod].count += 1;
                    return acc;
                }, {});
    
                const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
                Object.keys(paymentMethods).forEach(method => {
                    paymentMethods[method].percentage = (paymentMethods[method].amount / totalAmount) * 100 || 0;
                });
    
                // Calculate grade-wise collection
                const gradeWiseCollection = Object.keys(GRADE_FEES).map(grade => {
                    const gradeStudents = students.filter(student => student.grade === grade);
                    const totalFees = gradeStudents.length * GRADE_FEES[grade];
                    const collected = gradeStudents.reduce((sum, student) => sum + (student.paidFees || 0), 0);
                    const pending = totalFees - collected;
                    const collectionRate = totalFees > 0 ? (collected / totalFees) * 100 : 0;
    
                    return {
                        grade,
                        totalFees,
                        collected,
                        pending,
                        collectionRate
                    };
                });
    
                return {
                    totalTransactions: filteredPayments.length,
                    totalAmount,
                    averagePayment: filteredPayments.length > 0 ? totalAmount / filteredPayments.length : 0,
                    paymentMethods,
                    gradeWiseCollection
                };
            };
    
            const report = generateReport();
            
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
    
                    <div className="report-summary-cards">
                        <div className="report-card">
                            <h3>Total Transactions</h3>
                            <span className="report-value">{report.totalTransactions}</span>
                        </div>
                        <div className="report-card">
                            <h3>Total Amount</h3>
                            <span className="report-value">
                                ${report.totalAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="report-card">
                            <h3>Average Payment</h3>
                            <span className="report-value">
                                ${report.averagePayment.toFixed(2)}
                            </span>
                        </div>
                    </div>
    
                    <div className="payment-methods-breakdown">
                        <h3>Payment Methods Breakdown</h3>
                        <div className="payment-methods-grid">
                            {Object.entries(report.paymentMethods).map(([method, data]) => (
                                <div key={method} className="payment-method-card">
                                    <h4>{method.replace('_', ' ')}</h4>
                                    <div className="method-stats">
                                        <div className="method-stat">
                                            <span>Amount</span>
                                            <span>${data.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="method-stat">
                                            <span>Transactions</span>
                                            <span>{data.count}</span>
                                        </div>
                                        <div className="method-stat">
                                            <span>Percentage</span>
                                            <span>{data.percentage.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
    
                    <div className="grade-wise-collection">
                        <h3>Grade-wise Collection</h3>
                        <table className="grade-collection-table">
                            <thead>
                                <tr>
                                    <th>Grade</th>
                                    <th>Total Fees</th>
                                    <th>Collected</th>
                                    <th>Pending</th>
                                    <th>Collection Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.gradeWiseCollection.map(grade => (
                                    <tr key={grade.grade}>
                                        <td>{grade.grade}</td>
                                        <td>${grade.totalFees.toFixed(2)}</td>
                                        <td>${grade.collected.toFixed(2)}</td>
                                        <td>${grade.pending.toFixed(2)}</td>
                                        <td>
                                            <div className="collection-rate-bar">
                                                <div 
                                                    className="collection-rate-fill"
                                                    style={{ width: `${grade.collectionRate}%` }}
                                                />
                                                <span>{grade.collectionRate.toFixed(1)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                            className={`finance-tab ${activeTab === 'temp-access' ? 'active' : ''}`}
                            onClick={() => setActiveTab('temp-access')}
                        >
                            Temporary Access
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
                    {activeTab === 'temp-access' && renderTemporaryAccess()}
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
                                            studentId: e.target.value,
                                            amount: ''
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
                                        placeholder="Enter amount"
                                        required
                                    />
                                    {formData.studentId && (
                                        <small className="remaining-fees-info">
                                            {(() => {
                                                const student = students.find(s => s._id === formData.studentId);
                                                if (student) {
                                                    const totalFees = GRADE_FEES[student.grade];
                                                    const paidFees = student.paidFees || 0;
                                                    const remaining = totalFees - paidFees;
                                                    return `Remaining fees: $${remaining.toFixed(2)}`;
                                                }
                                                return '';
                                            })()}
                                        </small>
                                    )}
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