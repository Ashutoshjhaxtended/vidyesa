# Expense Tracker

A simple and elegant Expense Tracker application built with Next.js 14+ (App Router) and Tailwind CSS.

## Features

- 📊 **Dashboard**: View total expenses and all expense entries
- ➕ **Add Expense**: Add new expenses with category, amount, and description
- 🗑️ **Delete Expense**: Remove expenses from the list
- ⚡ **Real-time Updates**: No page reload needed - updates happen instantly
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- ✅ **Form Validation**: Prevents negative amounts and empty fields
- 🔄 **Loading States**: Visual feedback during form submission

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Data Storage**: Vercel KV in production, local JSON fallback in development
- **Server Actions**: Used for data mutations (Add/Delete)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vidysea
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vidysea/
├── app/
│   ├── actions.js          # Server Actions for add/delete
│   ├── layout.js           # Root layout
│   ├── page.js             # Dashboard page
│   └── globals.css         # Global styles
├── components/
│   ├── ExpenseForm.js      # Add expense form component
│   └── ExpenseList.js      # Expense list component
├── lib/
│   └── expenses.js         # Data storage utilities (KV + dev file fallback)
└── data/
    └── expenses.json       # Dev-only fallback data (auto-created locally)
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. In Project Settings → Environment Variables, set:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   (from Vercel KV integration)
5. Deploy

The app uses Vercel KV for persistent storage in production. In local dev, it falls back to `data/expenses.json`.

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy"

## Features Implementation

- ✅ Server Actions for data mutations
- ✅ Loading states during form submission
- ✅ Form validation (no negative amounts, required fields)
- ✅ Automatic total calculation
- ✅ Real-time UI updates without page reload
- ✅ Responsive design

## License

MIT
