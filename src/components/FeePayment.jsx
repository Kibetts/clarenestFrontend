import React, { useState, useEffect } from 'react';
import '../css/FeePayment.css';

function FeePayment() {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [balance, setBalance] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await fetch('/api/fee-payments/balance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch balance');
            const data = await response.json();
            setBalance(data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('/api/fee-payments/record-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount: parseFloat(amount), paymentMethod })
            });
            if (!response.ok) throw new Error('Failed to record payment');
            
            const data = await response.json();
            setMessage(`Payment of ${amount} successfully recorded!`);
            setBalance(data.newBalance);
            setAmount('');
            setPaymentMethod('');
        } catch (error) {
            console.error('Error recording payment:', error);
            setMessage('Failed to record payment. Please try again.');
        }
    };

    return (
        <div className="fee-payment">
            <h2>Fee Payment</h2>
            <p>Current Balance: ${balance.toFixed(2)}</p>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    required
                />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                >
                    <option value="">Select Payment Method</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                </select>
                <button type="submit">Submit Payment</button>
            </form>
        </div>
    );
}

export default FeePayment;