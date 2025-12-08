import React, { useContext, useEffect, useState } from 'react';
import { getTestMessage } from '../api';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Edit, Trash2 } from 'lucide-react';

export const Dashboard = () => {
  const { transactions, user, deleteTransaction } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    getTestMessage()
      .then(response => {
        setBackendMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching test message:', error);
        setBackendMessage('Could not connect to backend.');
      });
  }, []);

  const amounts = transactions.map(transaction => transaction.amount);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);
  const total = (Number(income) - Number(expense)).toFixed(2);

  // Prepare data for charts
  const expenseData = [
    { name: 'Income', value: Number(income) },
    { name: 'Expense', value: Number(expense) },
  ];
  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div className="dashboard">
      <div className="header">
        <h1>Welcome back, {user ? user.name : 'User'}</h1>
        <p>{backendMessage}</p>
        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="summary-cards">
        <div className="card">
            <div className="card-header">
                <span>Total Balance</span>
                <Wallet size={20} />
            </div>
            <h3 style={{ color: total < 0 ? '#e3516e' : '#2cc28b' }}>₹{Math.abs(total).toFixed(2)}</h3>
        </div>
        <div className="card income clickable-card" onClick={() => navigate('/income')}>
            <div className="card-header">
                <span>Income</span>
                <ArrowUpCircle size={20} />
            </div>
            <h3>₹{income}</h3>
        </div>
        <div className="card expense clickable-card" onClick={() => navigate('/expenses')}>
            <div className="card-header">
                <span>Expense</span>
                <ArrowDownCircle size={20} />
            </div>
            <h3>₹{expense}</h3>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
            <h3>Cash Flow Ratio</h3>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={expenseData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {expenseData.map((entry, index) => (
                        <Cell key={`cell-₹{index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="recent-transactions">
            <h3>Recent Activity</h3>
            {transactions.length === 0 ? (
              <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
                No transactions yet. Add your first transaction!
              </p>
            ) : (
              <ul>
                  {transactions.slice(0, 5).map(t => (
                      <li key={t.id} className={t.amount < 0 ? 'minus' : 'plus'}>
                          <div className="t-info">
                              <span className="t-cat">{t.category}</span>
                              <span className="t-name">{t.text}</span>
                              <span className="t-date" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                {t.date}
                              </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span className="t-amount">
                                  {t.amount < 0 ? '-' : '+'}₹{Math.abs(t.amount).toFixed(2)}
                              </span>
                              <button 
                                onClick={() => navigate(`/edit/₹{t.id}`)}
                                className="icon-btn"
                                title="Edit"
                                aria-label="Edit transaction"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this transaction?')) {
                                    deleteTransaction(t.id);
                                  }
                                }}
                                className="icon-btn delete-btn"
                                title="Delete"
                                aria-label="Delete transaction"
                              >
                                <Trash2 size={16} />
                              </button>
                          </div>
                      </li>
                  ))}
              </ul>
            )}
        </div>
      </div>
    </div>
  );
};