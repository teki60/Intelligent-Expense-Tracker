import React, { useState, useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const Expenses = () => {
  const { transactions, deleteTransaction } = useContext(GlobalContext);
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // date, amount, category
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Get all expenses (negative amounts)
  const expenses = useMemo(() => {
    return transactions.filter(t => t.amount < 0);
  }, [transactions]);

  // Get unique categories from expenses
  const categories = useMemo(() => {
    const cats = [...new Set(expenses.map(e => e.category))];
    return ['All', ...cats.sort()];
  }, [expenses]);

  // Filter and sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = Math.abs(a.amount) - Math.abs(b.amount);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [expenses, selectedCategory, sortBy, sortOrder]);

  const totalExpenses = useMemo(() => {
    return filteredAndSortedExpenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
  }, [filteredAndSortedExpenses]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="expenses-page">
      <div className="expenses-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <h1>All Expenses</h1>
        <p className="expenses-subtitle">
          {filteredAndSortedExpenses.length} expense{filteredAndSortedExpenses.length !== 1 ? 's' : ''} found
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      <div className="expenses-controls">
        <div className="control-group">
          <label>
            <Filter size={18} />
            Filter by Category
          </label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>
            <ArrowUpDown size={18} />
            Sort By
          </label>
          <div className="sort-buttons">
            <button
              onClick={() => handleSort('date')}
              className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
            </button>
            <button
              onClick={() => handleSort('amount')}
              className={`sort-btn ${sortBy === 'amount' ? 'active' : ''}`}
            >
              Amount {sortBy === 'amount' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
            </button>
            <button
              onClick={() => handleSort('category')}
              className={`sort-btn ${sortBy === 'category' ? 'active' : ''}`}
            >
              Category {sortBy === 'category' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
            </button>
          </div>
        </div>

        <div className="total-summary">
          <span className="total-label">Total:</span>
          <span className="total-amount">₹{totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      <div className="expenses-list-container">
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💰</div>
            <h3>No expenses found</h3>
            <p>
              {selectedCategory !== 'All' 
                ? `No expenses in ${selectedCategory} category. Try selecting a different category.`
                : 'You haven\'t added any expenses yet. Start tracking your expenses!'}
            </p>
          </div>
        ) : (
          <div className="expenses-list">
            {filteredAndSortedExpenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-main">
                  <div className="expense-info">
                    <div className="expense-category-badge">{expense.category}</div>
                    <h3 className="expense-name">{expense.text}</h3>
                    <span className="expense-date">{formatDate(expense.date)}</span>
                  </div>
                  <div className="expense-amount">
                    ₹{Math.abs(expense.amount).toFixed(2)}
                  </div>
                </div>
                <div className="expense-actions">
                  <button
                    onClick={() => navigate(`/edit/${expense.id}`)}
                    className="action-btn edit-btn"
                    title="Edit expense"
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this expense?')) {
                        deleteTransaction(expense.id);
                      }
                    }}
                    className="action-btn delete-btn"
                    title="Delete expense"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

