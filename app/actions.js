  'use server';

  import { getExpenses, saveExpenses } from '@/lib/expenses';
  import { revalidatePath } from 'next/cache';

  export async function addExpense(formData) {
    const category = formData.get('category');
    const amount = parseFloat(formData.get('amount'));
    const description = formData.get('description');

    // Validation
    if (!category || !description || !amount) {
      return { error: 'All fields are required' };
    }

    if (amount <= 0) {
      return { error: 'Amount must be greater than 0' };
    }

    if (isNaN(amount)) {
      return { error: 'Amount must be a valid number' };
    }

    const expenses = await getExpenses();
    const newExpense = {
      id: Date.now().toString(),
      category,
      amount,
      description,
      createdAt: new Date().toISOString(),
    };

    expenses.push(newExpense);
    const saved = await saveExpenses(expenses);

    if (saved) {
      revalidatePath('/');
      return { success: true };
    } else {
      return { error: 'Failed to save expense' };
    }
  }

  export async function deleteExpense(id) {
    const expenses = await getExpenses();
    const filteredExpenses = expenses.filter((expense) => expense.id !== id);
    const saved = await saveExpenses(filteredExpenses);

    if (saved) {
      revalidatePath('/');
      return { success: true };
    } else {
      return { error: 'Failed to delete expense' };
    }
  }
