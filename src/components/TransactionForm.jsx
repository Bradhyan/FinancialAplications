import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import './TransactionForm.css';

const TransactionForm = ({ onClose }) => {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Other'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Transaction</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="type-toggle">
            <button 
              type="button" 
              className={`toggle-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setFormData({...formData, type: 'expense'})}
            >
              Expense
            </button>
            <button 
              type="button" 
              className={`toggle-btn ${formData.type === 'income' ? 'active income' : ''}`}
              onClick={() => setFormData({...formData, type: 'income'})}
            >
              Income
            </button>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="e.g., Groceries, Salary" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">$</span>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount} 
                onChange={handleChange} 
                placeholder="0.00" 
                step="0.01" 
                min="0"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
              <option value="Housing">Housing</option>
              <option value="Salary">Salary</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
