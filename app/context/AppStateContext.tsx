import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Bet } from "../types/Bet";
import type { Wallet } from "../types/Wallet";
import type { WalletTransaction } from "../types/WalletTransaction";
import {
  apiGetBets,
  apiAddBet,
  apiUpdateBet,
  apiDeleteBet,
  apiGetWallet,
  apiGetWalletTransactions,
  apiAddWalletTransaction,
  apiDeleteWalletTransaction,
  AuthError,
} from "../utils/api";

type State = {
  bets: Bet[];
  wallet: Wallet | null;
  transactions: WalletTransaction[];
};

type Action =
  | { type: "SET_BETS"; bets: Bet[] }
  | { type: "ADD_BET"; bet: Bet }
  | { type: "DELETE_BET"; id: string }
  | { type: "SET_WALLET"; wallet: Wallet }
  | { type: "SET_TRANSACTIONS"; transactions: WalletTransaction[] }
  | { type: "ADD_TRANSACTION"; transaction: WalletTransaction }
  | { type: "DELETE_TRANSACTION"; id: string };

const initialState: State = {
  bets: [],
  wallet: null,
  transactions: [],
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
      return { ...state, wallet: action.wallet };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.transactions };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.transaction, ...state.transactions] };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

const AppStateContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  refresh: () => Promise<void>;
  addBet: (bet: Bet) => Promise<void>;
  updateBet: (bet: Bet) => Promise<void>;
  deleteBet: (id: string) => Promise<void>;
  addTransaction: (tx: WalletTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}>({
  state: initialState,
  dispatch: () => {},
  refresh: async () => {},
  addBet: async () => {},
  updateBet: async () => {},
  deleteBet: async () => {},
  addTransaction: async () => {},
  deleteTransaction: async () => {},
});

export const useAppState = () => useContext(AppStateContext);

export const AppStateProvider: React.FC<{ children: React.ReactNode; onAuthError?: () => void }> = ({
  children,
  onAuthError,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from API on mount
  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);

  async function refresh() {
    try {
      const [bets, wallet, transactions] = await Promise.all([
        apiGetBets(),
        apiGetWallet(),
        apiGetWalletTransactions(),
      ]);
      dispatch({ type: "SET_BETS", bets });
      dispatch({ type: "SET_WALLET", wallet });
      dispatch({ type: "SET_TRANSACTIONS", transactions });
    } catch (err) {
      if (err instanceof AuthError && onAuthError) {
        onAuthError();
      }
      // handle other errors (e.g., show notification)
    }
  }

  async function addBet(bet: Bet) {
    try {
      const newBet = await apiAddBet(bet);
      dispatch({ type: "ADD_BET", bet: newBet });
      await refresh();
    } catch (err) {
      if (err instanceof AuthError && onAuthError) onAuthError();
    }
  }

  async function updateBet(bet: Bet) {
    try {
      await apiUpdateBet(bet);
      await refresh();
    } catch (err) {
      if (err instanceof AuthError && onAuthError) onAuthError();
    }
  }

  async function deleteBet(id: string) {
    try {
      await apiDeleteBet(id);
      dispatch({ type: "DELETE_BET", id });
      await refresh();
    } catch (err) {
      if (err instanceof AuthError && onAuthError) onAuthError();
    }
  }

  async function addTransaction(tx: WalletTransaction) {
    try {
      const newTx = await apiAddWalletTransaction(tx);
      dispatch({ type: "ADD_TRANSACTION", transaction: newTx });
      await refresh();
    } catch (err) {
      if (err instanceof AuthError && onAuthError) onAuthError();
    }
  }

  async function deleteTransaction(id: string) {
    try {
      await apiDeleteWalletTransaction(id);
      dispatch({ type: "DELETE_TRANSACTION", id });
      await refresh();
    } catch (err) {
      if (err instanceof AuthError && onAuthError) onAuthError();
    }
  }

  return (
    <AppStateContext.Provider
      value={{
        state,
        dispatch,
        refresh,
        addBet,
        updateBet,
        deleteBet,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};