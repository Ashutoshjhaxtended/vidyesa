'use client';

import { useEffect, useMemo, useState } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';

const STORAGE_KEY = 'expenses';

export default function Home() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setExpenses(
          parsed.map((e) => ({
            ...e,
            amount: Number(e.amount) || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to load expenses from localStorage:', error);
    }
  }, []);

  function saveToStorage(nextExpenses) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextExpenses));
    } catch (error) {
      console.error('Failed to save expenses to localStorage:', error);
    }
  }

  async function handleAddExpense(formData) {
    const category = formData.get('category')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const amountRaw = formData.get('amount');
    const amount = parseFloat(amountRaw);

    if (!category || !description || !amountRaw) {
      return { error: 'All fields are required' };
    }

    if (Number.isNaN(amount)) {
      return { error: 'Amount must be a valid number' };
    }

    if (amount <= 0) {
      return { error: 'Amount must be greater than 0' };
    }

    const newExpense = {
      id: Date.now().toString(),
      category,
      amount,
      description,
      createdAt: new Date().toISOString(),
    };

    const next = [...expenses, newExpense];
    setExpenses(next);
    saveToStorage(next);

    return { success: true };
  }

  async function handleDeleteExpense(id) {
    const next = expenses.filter((expense) => expense.id !== id);
    setExpenses(next);
    saveToStorage(next);
    return { success: true };
  }

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0),
    [expenses]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Expense Tracker with Ci CD
          </h1>
          <p className="text-gray-600">Manage your expenses efficiently</p>
        </header>

        {/* Total Expenses Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Expenses
              </h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${total.toFixed(2)}
              </p>
            </div>
            <div className="bg-indigo-100 rounded-full p-4">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Expense Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Expense
            </h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          {/* Expenses List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Expenses
            </h2>
            <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          </div>
        </div>
      </div>
    </div>
  );
}
