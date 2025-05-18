# Bet Tracker

**Web Programming Lab 6**  
**Project:** Bet Tracker  
**Author:** [Bostan Victor]  
**Group:** [FAF-222]

---

Bet Tracker is an application for tracking your sports bets, analyzing your betting performance, and managing your wallet. The app is built with React Router, TypeScript, and Tailwind CSS, and supports both light and dark themes.

## Features

- **Add, edit, and delete bets** with details such as type, amount, odds, outcome, notes, and favorite status.
- **Wallet management**: deposit, withdraw, and view transaction history.
- **Dashboard**: see statistics like total bets, win/loss/draw/pending counts, profit, win rate, average bet, biggest win/loss, and more.
- **Profit over time chart** with interactive tooltips.
- **Filter and search** your bets by outcome, type, favorites, and notes.
- **Smooth Theme Switching**(light/dark).
- **Data persistence** using IndexedDB (your data stays in your browser).

## Main Flows

### 1. Home Page
- View a summary of your betting stats and your most recent bets.
- Access your wallet and dashboard from the header.
- Add a new bet using the floating "+" button.

### 2. Add Bet
- Fill out the form with bet details (date, type, amount, odds, outcome, notes, favorite).
- On submit, the bet is added to your list and wallet is updated accordingly.

### 3. Edit Bet
- Edit any existing bet by clicking "Edit" on a bet card.
- Update details and save changes; wallet and stats update automatically.

### 4. Wallet
- View your current balance and all wallet transactions (deposits, withdrawals, bets, payouts).
- Deposit or withdraw funds using the wallet form.

### 5. Dashboard
- See detailed statistics about your betting history.
- Visualize your profit over time with an interactive chart.

### 6. Bet List
- Filter bets by outcome, type, favorites, or search by text.
- Edit or delete bets directly from the list.

### 7. Theme Switching
- Use the theme toggle button (top left) to switch between light and dark mode. The entire app updates instantly.

## How It Works

- All data is stored in your browser using IndexedDB.
- The global theme switcher uses CSS variables for instant color changes across all components.

## Project Structure

- `app/Pages/` — Main page components (Home, Dashboard, Wallet, etc.)
- `app/components/` — Reusable UI components (BetList, AddBetForm, WalletPanel, etc.)
- `app/context/` — React context providers for app state and theme
- `app/types/` — TypeScript types for bets, wallet, transactions
- `app/utils/` — Utility functions (IndexedDB, etc.)
- `app/routes/` — Route definitions for React Router
