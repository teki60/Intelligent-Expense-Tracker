import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider, GlobalContext } from './context/GlobalContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { Expenses } from './pages/Expenses';
import { Income } from './pages/Income';
import { Login } from './pages/Login';
import './App.css';

const Layout = ({ children }) => {
  const { user } = useContext(GlobalContext);
  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes wrapped in Layout */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/add" element={<Layout><AddExpense /></Layout>} />
          <Route path="/edit/:id" element={<Layout><AddExpense /></Layout>} />
          <Route path="/expenses" element={<Layout><Expenses /></Layout>} />
          <Route path="/income" element={<Layout><Income /></Layout>} />
          
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;