import { getExpenses, getTotalExpenses } from '@/lib/expenses';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';

export default async function Home() {
  const expenses = await getExpenses();
  const total = await getTotalExpenses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Expense Tracker
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
            <ExpenseForm />
          </div>

          {/* Expenses List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Expenses
            </h2>
            <ExpenseList expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
