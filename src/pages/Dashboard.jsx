import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import TransactionForm from '../components/TransactionForm';
import './Dashboard.css';

const Dashboard = () => {
  const { transactions, getSummary } = useFinance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const summary = getSummary();

  // Prepare data for the chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date.startsWith(date));
    const income = dayTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    return {
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      income,
      expense
    };
  });

  const recentTransactions = transactions.slice(0, 5);

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});

  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));

  const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your financial overview.</p>
        </div>
        <button className="primary-button" onClick={() => setIsFormOpen(true)}>
          + Add Transaction
        </button>
      </div>

      <div className="summary-cards">
        <div className="card glass-panel total-balance">
          <div className="card-icon">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div className="card-content">
            <h3>Total Balance</h3>
            <p className="amount">${summary.balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="card glass-panel income">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          </div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">${summary.income.toFixed(2)}</p>
          </div>
        </div>

        <div className="card glass-panel expense">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
          </div>
          <div className="card-content">
            <h3>Total Expense</h3>
            <p className="amount">${summary.expense.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-container glass-panel">
          <h3>Activity Overview (Last 7 Days)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-glass)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Bar dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="expense-chart-container glass-panel">
            <h3>Expenses by Category</h3>
            <div className="pie-wrapper">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--text-main)' }}
                      formatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state">
                  <p>No expenses yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="recent-transactions glass-panel">
            <h3>Recent Transactions</h3>
            {recentTransactions.length > 0 ? (
              <ul className="transaction-list">
                {recentTransactions.map(t => (
                <li key={t.id} className="transaction-item">
                  <div className={`transaction-icon ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}
                  </div>
                  <div className="transaction-details">
                    <h4>{t.title}</h4>
                    <span className="date">{new Date(t.date).toLocaleDateString()}</span>
                  </div>
                  <div className={`transaction-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p>No recent transactions.</p>
              <button className="text-button" onClick={() => setIsFormOpen(true)}>Add your first transaction</button>
            </div>
          )}
        </div>
        </div>
      </div>

      {isFormOpen && <TransactionForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default Dashboard;
