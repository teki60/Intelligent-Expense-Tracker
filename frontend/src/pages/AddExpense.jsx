import React, { useState, useContext, useEffect, useRef } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export const AddExpense = () => {
  const { id } = useParams();
  const location = useLocation();
  const isEditMode = !!id;
  const prevPathRef = useRef(location.pathname);
  
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categorizing, setCategorizing] = useState(false);
  const [categorizationResult, setCategorizationResult] = useState(null);
  
  const { addTransaction, updateTransaction, transactions, generateId } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Clear form when navigating from edit to add mode
  useEffect(() => {
    const wasEditMode = prevPathRef.current.includes('/edit/');
    const isAddMode = location.pathname === '/add';
    
    if (wasEditMode && isAddMode) {
      // User navigated from edit to add, clear the form
      setText('');
      setCategorizationResult(null);
      setError('');
    }
    
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  // Load transaction data if editing
  useEffect(() => {
    if (isEditMode) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setText(transaction.text);
        // Pre-populate categorization result with existing transaction data
        setCategorizationResult({
          category: transaction.category,
          paymentType: 'N/A', // This might not be stored in the transaction
          type: transaction.amount >= 0 ? 'income' : 'expense',
          amount: Math.abs(transaction.amount),
        });
      } else {
        setError('Transaction not found');
        setTimeout(() => navigate('/'), 2000);
      }
    }
  }, [id, isEditMode, transactions, navigate]);

  const handleCategorize = async () => {
    setError('');
    
    if (!text.trim()) {
      setError('Please enter a description first');
      return;
    }

    setCategorizing(true);
    setCategorizationResult(null);

    try {
      // TODO: Replace this with your actual backend API endpoint
      const response = await fetch('YOUR_BACKEND_API_ENDPOINT/categorize', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: text.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to categorize transaction');
      }

      const data = await response.json();
      
      // Expected response format:
      // {
      //   category: "Food",
      //   paymentType: "UPI",
      //   type: "expense", // or "income"
      //   amount: 120,
      //   // ... any other fields your backend returns
      // }
      
      setCategorizationResult(data);
    } catch (err) {
      setError('Failed to categorize. Please check your backend connection.');
      console.error('Categorization error:', err);
      
      // For demo purposes, show mock data if backend is not available
      // Remove this when backend is integrated
      setCategorizationResult({
        category: 'Food',
        paymentType: 'UPI',
        type: 'expense',
        amount: 120
      });
    } finally {
      setCategorizing(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!text.trim()) {
      setError('Description is required');
      return;
    }

    // Check if categorization was done (only for new transactions)
    if (!isEditMode && !categorizationResult) {
      setError('Please click "Categorize" first to analyze the transaction');
      return;
    }

    setLoading(true);

    try {
      const description = text.trim();
      
      // Use categorization results or existing transaction data
      const amount = categorizationResult?.amount || 0;
      const category = categorizationResult?.category || 'General';
      const isIncome = categorizationResult?.type === 'income';
      const finalAmount = isIncome ? Math.abs(amount) : -Math.abs(amount);
      
      // Format date consistently (YYYY-MM-DD)
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      if (isEditMode) {
        // Update existing transaction
        const existingTransaction = transactions.find(t => t.id === id);
        const updatedTransaction = {
          id: id,
          text: description,
          amount: categorizationResult ? finalAmount : existingTransaction.amount,
          category: categorizationResult ? category : existingTransaction.category,
          date: existingTransaction.date || dateStr // Keep original date when editing
        };
        updateTransaction(updatedTransaction);
      } else {
        // Add new transaction
        const newTransaction = {
          id: generateId(),
          text: description,
          amount: finalAmount,
          category: category,
          date: dateStr
        };
        addTransaction(newTransaction);
      }
      
      setText('');
      setCategorizationResult(null);
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'add'} transaction. Please try again.`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <div className="add-expense-wrapper">
        <div className="form-section">
          <h3>{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {isEditMode 
              ? 'Update the transaction description and re-categorize if needed.'
              : 'Describe your transaction and click "Categorize" to analyze it with AI.'}
          </p>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setCategorizationResult(null); // Clear results when description changes
                }}
                placeholder="e.g. Paid ₹120 for lunch at restaurant via UPI, Bought groceries for ₹45, Received ₹1500 salary payment"
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <button 
                type="button" 
                onClick={handleCategorize}
                className="btn-secondary" 
                disabled={categorizing || !text.trim()}
              >
                {categorizing ? 'Categorizing...' : 'Categorize'}
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loading || (!isEditMode && !categorizationResult)}>
              {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Transaction' : 'Add Transaction')}
            </button>
          </form>
        </div>

        <div className="results-section">
          {categorizationResult ? (
            <div className="categorization-result">
              <h4 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
                Categorization Results
              </h4>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Category:</span>
                  <span className="result-value">{categorizationResult.category || 'N/A'}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Payment Type:</span>
                  <span className="result-value">{categorizationResult.paymentType || 'N/A'}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Type:</span>
                  <span className={`result-value ${categorizationResult.type === 'income' ? 'income-badge' : 'expense-badge'}`}>
                    {categorizationResult.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </div>
                <div className="result-item">
                  <span className="result-label">Amount:</span>
                  <span className="result-value amount-value">
                    ₹{categorizationResult.amount ? Math.abs(categorizationResult.amount).toFixed(2) : '0.00'}
                  </span>
                </div>

              </div>
            </div>
          ) : (
            <div className="categorization-placeholder">
              <div className="placeholder-content">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                  <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h4 style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }}>Ready to Categorize</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center' }}>
                  Enter a description and click "Categorize" to see the AI analysis results here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
