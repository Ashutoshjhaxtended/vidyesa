async function getFromLocalFileDevOnly() {
  // Local dev fallback only (Vercel serverless filesystem is not persistent)
  const fs = await import('fs');
  const path = await import('path');

  const dataFilePath = path.join(process.cwd(), 'data', 'expenses.json');
  const dataDir = path.join(process.cwd(), 'data');

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFilePath)) fs.writeFileSync(dataFilePath, JSON.stringify([], null, 2));

  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading expenses (dev file):', error);
    return [];
  }
}

async function saveToLocalFileDevOnly(expenses) {
  const fs = await import('fs');
  const path = await import('path');

  const dataFilePath = path.join(process.cwd(), 'data', 'expenses.json');
  const dataDir = path.join(process.cwd(), 'data');

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving expenses (dev file):', error);
    return false;
  }
}

// Read expenses (file in dev; empty list in production)
export async function getExpenses() {
  if (process.env.NODE_ENV === 'development') return await getFromLocalFileDevOnly();
  return [];
}

// Write expenses (file in dev; no-op in production)
export async function saveExpenses(expenses) {
  if (process.env.NODE_ENV === 'development') return await saveToLocalFileDevOnly(expenses);
  // In production, we don't persist anywhere (no KV / no filesystem writes)
  return true;
}

// Calculate total expenses
export async function getTotalExpenses() {
  const expenses = await getExpenses();
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}
