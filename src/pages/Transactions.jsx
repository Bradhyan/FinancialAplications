import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/TransactionForm';
import './Transactions.css';

const Transactions = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, income, expense

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="transactions-page animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>Transactions</h1>
          <p>Review and manage all your financial activity.</p>
        </div>
        <button className="primary-button" onClick={() => setIsFormOpen(true)}>
          + Add Transaction
        </button>
      </div>

      <div className="transactions-container glass-panel">
        <div className="transactions-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >All</button>
          <button 
            className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
            onClick={() => setFilter('income')}
          >Income</button>
          <button 
            className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
            onClick={() => setFilter('expense')}
          >Expenses</button>
        </div>

        <div className="table-responsive">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th className="amount-col">Amount</th>
                <th className="actions-col"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="table-row">
                    <td className="date-cell">{new Date(t.date).toLocaleDateString()}</td>
                    <td><strong>{t.title}</strong></td>
                    <td>
                      <span className="category-badge">{t.category}</span>
                    </td>
                    <td>
                       <span className={`type-badge ${t.type}`}>
                         {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                       </span>
                    </td>
                    <td className={`amount-col ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                    </td>
                    <td className="actions-col">
                      <button className="delete-btn" onClick={() => deleteTransaction(t.id)} title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Transactions;
