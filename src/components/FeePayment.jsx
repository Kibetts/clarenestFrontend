import React, { useState, useEffect } from 'react';
import '../css/FeePayment.css';

function FeePayment() {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [balance, setBalance] = useState(0);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        fetchBalanceAndHistory();
    }, []);

    const fetchBalanceAndHistory = async () => {
        try {
            setLoading(true);
            const balanceResponse = await fetch('/api/fee-payments/balance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const historyResponse = await fetch('/api/fee-payments/history', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!balanceResponse.ok || !historyResponse.ok) {
                throw new Error('Failed to fetch payment data');
            }

            const balanceData = await balanceResponse.json();
            const historyData = await historyResponse.json();

            setBalance(balanceData.balance);
            setPaymentHistory(historyData.payments);
            setError(null);
        } catch (error) {
            setError('Error fetching payment information');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const confirmPayment = async () => {
        try {
            const response = await fetch('/api/fee-payments/record-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    amount: parseFloat(amount), 
                    paymentMethod 
                })
            });

            if (!response.ok) throw new Error('Failed to record payment');
            
            const data = await response.json();
            setMessage('Payment successfully recorded!');
            setBalance(data.newBalance);
            setAmount('');
            setPaymentMethod('');
            fetchBalanceAndHistory();
        } catch (error) {
            setMessage('Failed to record payment. Please try again.');
        } finally {
            setShowConfirmation(false);
        }
    };

    if (loading) return <div className="fee-loading">Loading...</div>;
    if (error) return <div className="fee-error">{error}</div>;

    return (
        <div className="fee-payment">
            <div className="fee-payment-container">
                <header className="fee-header">
                    <h2>Fee Payment</h2>
                    <div className="fee-balance">
                        <span className="fee-balance-label">Current Balance:</span>
                        <span className="fee-balance-amount">
                            ${balance.toFixed(2)}
                        </span>
                    </div>
                </header>

                <div className="fee-content">
                    <div className="fee-payment-section">
                        <h3>Make a Payment</h3>
                        <form onSubmit={handleSubmit} className="fee-form">
                            <div className="fee-form-group">
                                <label className="fee-label">Amount</label>
                                <div className="fee-input-group">
                                    <span className="fee-currency">$</span>
                                    <input
                                        type="number"
                                        className="fee-input"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        min="0.01"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="fee-form-group">
                                <label className="fee-label">Payment Method</label>
                                <select
                                    className="fee-select"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    required
                                >
                                    <option value="">Select Payment Method</option>
                                    <option value="credit_card">Credit Card</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>

                            <button type="submit" className="fee-submit-btn">
                                Submit Payment
                            </button>
                        </form>
                    </div>

                    <div className="fee-history-section">
                        <h3>Payment History</h3>
                        <div className="fee-history-list">
                            {paymentHistory.length === 0 ? (
                                <p className="fee-no-history">No payment history available</p>
                            ) : (
                                paymentHistory.map((payment) => (
                                    <div key={payment._id} className="fee-history-item">
                                        <div className="fee-history-info">
                                            <span className="fee-history-date">
                                                {new Date(payment.date).toLocaleDateString()}
                                            </span>
                                            <span className="fee-history-method">
                                                {payment.paymentMethod.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <span className="fee-history-amount">
                                            ${payment.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`fee-message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                {showConfirmation && (
                    <div className="fee-modal-overlay">
                        <div className="fee-confirmation-modal">
                            <h3>Confirm Payment</h3>
                            <p>Are you sure you want to proceed with this payment?</p>
                            <div className="fee-payment-details">
                                <div className="fee-detail-item">
                                    <span>Amount:</span>
                                    <span>${amount}</span>
                                </div>
                                <div className="fee-detail-item">
                                    <span>Method:</span>
                                    <span>{paymentMethod.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="fee-modal-actions">
                                <button 
                                    className="fee-modal-cancel"
                                    onClick={() => setShowConfirmation(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="fee-modal-confirm"
                                    onClick={confirmPayment}
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeePayment;