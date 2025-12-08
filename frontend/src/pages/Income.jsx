import React, { useState, useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const Income = () => {
  const { transactions, deleteTransaction } = useContext(GlobalContext);
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date'); // date, amount, category
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Get all income (positive amounts)
  const income = useMemo(() => {
    return transactions.filter(t => t.amount > 0);
  }, [transactions]);

  // Get unique categories from income
  const categories = useMemo(() => {
    const cats = [...new Set(income.map(i => i.category))];
    return ['All', ...cats.sort()];
  }, [income]);

  // Filter and sort income
  const filteredAndSortedIncome = useMemo(() => {
    let filtered = income;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(i => i.category === selectedCategory);
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
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
  }, [income, selectedCategory, sortBy, sortOrder]);

  const totalIncome = useMemo(() => {
    return filteredAndSortedIncome.reduce((sum, i) => sum + i.amount, 0);
  }, [filteredAndSortedIncome]);

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
    <div className="expenses-page income-page">
      <div className="expenses-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        <h1>All Income</h1>
        <p className="expenses-subtitle">
          {filteredAndSortedIncome.length} income{filteredAndSortedIncome.length !== 1 ? 's' : ''} found
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

        <div className="total-summary income-total">
          <span className="total-label">Total:</span>
          <span className="total-amount">₹{totalIncome.toFixed(2)}</span>
        </div>
      </div>

      <div className="expenses-list-container">
        {filteredAndSortedIncome.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💵</div>
            <h3>No income found</h3>
            <p>
              {selectedCategory !== 'All' 
                ? `No income in ${selectedCategory} category. Try selecting a different category.`
                : 'You haven\'t added any income yet. Start tracking your income!'}
            </p>
          </div>
        ) : (
          <div className="expenses-list">
            {filteredAndSortedIncome.map(incomeItem => (
              <div key={incomeItem.id} className="expense-item income-item">
                <div className="expense-main">
                  <div className="expense-info">
                    <div className="expense-category-badge income-badge">{incomeItem.category}</div>
                    <h3 className="expense-name">{incomeItem.text}</h3>
                    <span className="expense-date">{formatDate(incomeItem.date)}</span>
                  </div>
                  <div className="expense-amount income-amount">
                    +₹{incomeItem.amount.toFixed(2)}
                  </div>
                </div>
                <div className="expense-actions">
                  <button
                    onClick={() => navigate(`/edit/${incomeItem.id}`)}
                    className="action-btn edit-btn"
                    title="Edit income"
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this income?')) {
                        deleteTransaction(incomeItem.id);
                      }
                    }}
                    className="action-btn delete-btn"
                    title="Delete income"
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

