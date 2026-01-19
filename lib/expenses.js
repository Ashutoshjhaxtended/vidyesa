import { kv } from '@vercel/kv';

const KV_KEY = 'expenses';
const storageWarning =
  'Storage not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN for Vercel KV. Falling back to empty data.';

function kvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getFromKv() {
  const stored = await kv.get(KV_KEY);
  return Array.isArray(stored) ? stored : [];
}

async function saveToKv(expenses) {
  await kv.set(KV_KEY, expenses);
  return true;
}

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

// Read expenses (KV on Vercel; file fallback in local dev; otherwise warn+empty)
export async function getExpenses() {
  if (kvConfigured()) return await getFromKv();
  if (process.env.NODE_ENV === 'development') return await getFromLocalFileDevOnly();

  console.warn(storageWarning);
  return [];
}

// Write expenses (KV on Vercel; file fallback in local dev; otherwise no-op)
export async function saveExpenses(expenses) {
  if (kvConfigured()) return await saveToKv(expenses);
  if (process.env.NODE_ENV === 'development') return await saveToLocalFileDevOnly(expenses);

  console.warn(storageWarning);
  return false;
}

// Calculate total expenses
export async function getTotalExpenses() {
  const expenses = await getExpenses();
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}
