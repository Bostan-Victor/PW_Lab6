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
    case "SET_BETS":
      return { ...state, bets: action.bets };
    case "ADD_BET":
      return { ...state, bets: [...state.bets, action.bet] };
    case "DELETE_BET":
      return { ...state, bets: state.bets.filter((b) => b.id !== action.id) };
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