import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Bet } from "../types/Bet";
import type { Wallet } from "../types/Wallet";
import type { WalletTransaction } from "../types/WalletTransaction";
import { getAll, put } from "../utils/db";

type State = {
  bets: Bet[];
  wallet: Wallet | null;
};

type Action =
  | { type: "SET_BETS"; bets: Bet[] }
  | { type: "ADD_BET"; bet: Bet }
  | { type: "DELETE_BET"; id: string }
  | { type: "SET_WALLET"; wallet: Wallet }
  | { type: "UPDATE_WALLET"; wallet: Wallet }
  | { type: "DEPOSIT"; amount: number }
  | { type: "WITHDRAW"; amount: number };

const initialState: State = {
  bets: [],
  wallet: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_BETS": {
      if (!state.wallet) return { ...state, bets: action.bets };
      let updatedWallet = state.wallet;

      action.bets.forEach((newBet) => {
        const oldBet = state.bets.find((b) => b.id === newBet.id);
        if (oldBet) {
          let transactions = updatedWallet.transactions.filter(
            (tx) => tx.betId !== newBet.id
          );
          let balance = updatedWallet.balance;

          balance += oldBet.amount;
          if (oldBet.outcome === "Won" || oldBet.outcome === "Draw") {
            balance -= oldBet.payout;
          }

          const betTx: WalletTransaction = {
            id: Math.random().toString(36).slice(2),
            type: "bet",
            amount: newBet.amount,
            date: newBet.date,
            betId: newBet.id,
          };
          transactions = [betTx, ...transactions];
          balance -= newBet.amount;

          if (newBet.outcome === "Won" || newBet.outcome === "Draw") {
            const payoutTx: WalletTransaction = {
              id: Math.random().toString(36).slice(2),
              type: "payout",
              amount: newBet.payout,
              date: newBet.date,
              betId: newBet.id,
            };
            transactions = [payoutTx, ...transactions];
            balance += newBet.payout;
          }

          updatedWallet = { ...updatedWallet, balance, transactions };
        }
      });

      return { ...state, bets: action.bets, wallet: updatedWallet };
    }

    case "ADD_BET": {
      const newBets = [...state.bets, action.bet];
      if (!state.wallet) return { ...state, bets: newBets };

      const betTx: WalletTransaction = {
        id: Math.random().toString(36).slice(2),
        type: "bet",
        amount: action.bet.amount,
        date: action.bet.date,
        betId: action.bet.id,
      };
      let transactions = [betTx, ...state.wallet.transactions];
      let balance = state.wallet.balance - action.bet.amount;

      if (action.bet.outcome === "Won" || action.bet.outcome === "Draw") {
        const payoutTx: WalletTransaction = {
          id: Math.random().toString(36).slice(2),
          type: "payout",
          amount: action.bet.payout,
          date: action.bet.date,
          betId: action.bet.id,
        };
        transactions = [payoutTx, ...transactions];
        balance += action.bet.payout;
      }

      const updatedWallet: Wallet = {
        ...state.wallet,
        balance,
        transactions,
      };
      return { ...state, bets: newBets, wallet: updatedWallet };
    }

    case "DELETE_BET": {
        if (!state.wallet) return { ...state, bets: state.bets.filter((b) => b.id !== action.id) };
        const betToDelete = state.bets.find((b) => b.id === action.id);
        if (!betToDelete) {
          return {
            ...state,
            bets: state.bets.filter((b) => b.id !== action.id),
          };
        }
        const transactions = state.wallet.transactions.filter(
          (tx) => tx.betId !== action.id
        );
        let balance = state.wallet.balance + Number(betToDelete.amount);
        if (betToDelete.outcome === "Won" || betToDelete.outcome === "Draw") {
          balance -= Number(betToDelete.payout);
        }
        return {
          ...state,
          bets: state.bets.filter((b) => b.id !== action.id),
          wallet: { ...state.wallet, balance, transactions },
        };
      }
    case "SET_WALLET":
    case "UPDATE_WALLET":
      return { ...state, wallet: action.wallet };
    case "DEPOSIT": {
      if (!state.wallet) return state;
      const newTransaction: WalletTransaction = {
        id: Math.random().toString(36).slice(2),
        type: "deposit",
        amount: action.amount,
        date: new Date().toISOString(),
      };
      const updatedWallet: Wallet = {
        ...state.wallet,
        balance: state.wallet.balance + action.amount,
        transactions: [newTransaction, ...state.wallet.transactions],
      };
      return { ...state, wallet: updatedWallet };
    }
    case "WITHDRAW": {
      if (!state.wallet) return state;
      const newTransaction: WalletTransaction = {
        id: Math.random().toString(36).slice(2),
        type: "withdrawal",
        amount: action.amount,
        date: new Date().toISOString(),
      };
      const updatedWallet: Wallet = {
        ...state.wallet,
        balance: state.wallet.balance - action.amount,
        transactions: [newTransaction, ...state.wallet.transactions],
      };
      return { ...state, wallet: updatedWallet };
    }
    default:
      return state;
  }
}

const AppStateContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export const useAppState = () => useContext(AppStateContext);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const bets = await getAll<Bet>("bets");
      dispatch({ type: "SET_BETS", bets });
      const wallets = await getAll<Wallet>("wallet");
      if (wallets.length > 0) {
        dispatch({ type: "SET_WALLET", wallet: wallets[0] });
      } else {
        dispatch({
          type: "SET_WALLET",
          wallet: { balance: 0, transactions: [] },
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (state.wallet) {
      put("wallet", { ...state.wallet, id: "main" });
    }
  }, [state.wallet]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};