import React, { createContext, useReducer, useEffect } from 'react';

// Load initial state from localStorage or use defaults
const loadInitialState = () => {
  try {
    const savedTransactions = localStorage.getItem('expenseTracker_transactions');
    const savedUser = localStorage.getItem('expenseTracker_user');
    const savedTheme = localStorage.getItem('expenseTracker_theme') || 'light';
    
    return {
      transactions: savedTransactions ? JSON.parse(savedTransactions) : [
        { id: '1', text: 'Client Lunch', amount: -120, category: 'Food', date: '2023-10-01' },
        { id: '2', text: 'Freelance Payment', amount: 1500, category: 'Income', date: '2023-10-03' },
        { id: '3', text: 'Office Supplies', amount: -45, category: 'Utilities', date: '2023-10-05' },
      ],
      user: savedUser ? JSON.parse(savedUser) : null,
      theme: savedTheme,
    };
  } catch (error) {
    console.error('Error loading initial state:', error);
    return {
      transactions: [
        { id: '1', text: 'Client Lunch', amount: -120, category: 'Food', date: '2023-10-01' },
        { id: '2', text: 'Freelance Payment', amount: 1500, category: 'Income', date: '2023-10-03' },
        { id: '3', text: 'Office Supplies', amount: -45, category: 'Utilities', date: '2023-10-05' },
      ],
      user: null,
      theme: 'light',
    };
  }
};

const initialState = loadInitialState();

export const GlobalContext = createContext(initialState);

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
};

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Persist transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('expenseTracker_transactions', JSON.stringify(state.transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }, [state.transactions]);

  // Persist user to localStorage
  useEffect(() => {
    try {
      if (state.user) {
        localStorage.setItem('expenseTracker_user', JSON.stringify(state.user));
      } else {
        localStorage.removeItem('expenseTracker_user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }, [state.user]);

  // Persist theme to localStorage and apply to document
  useEffect(() => {
    try {
      localStorage.setItem('expenseTracker_theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [state.theme]);

  function deleteTransaction(id) {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }

  function addTransaction(transaction) {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }

  function updateTransaction(transaction) {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  }

  function login(username) {
    dispatch({ type: 'LOGIN', payload: { name: username } });
  }

  function logout() {
    dispatch({ type: 'LOGOUT' });
  }

  function toggleTheme() {
    dispatch({ type: 'TOGGLE_THEME' });
  }

  // Generate unique ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  return (
    <GlobalContext.Provider value={{
      transactions: state.transactions,
      user: state.user,
      theme: state.theme,
      deleteTransaction,
      addTransaction,
      updateTransaction,
      login,
      logout,
      toggleTheme,
      generateId,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};