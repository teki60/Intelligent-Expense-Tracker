import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Assuming your backend runs on port 8080

const api = axios.create({
  baseURL: API_URL,
});

export const getTestMessage = () => api.get('/test');

// You can add other API functions here
/*
export const getExpenses = () => api.get('/expenses');
export const addExpense = (expense) => api.post('/expenses', expense);
export const getIncomes = () => api.get('/incomes');
export const addIncome = (income) => api.post('/incomes', income);
*/

export default api;