import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Bet } from "../types/Bet";
import type { Wallet } from "../types/Wallet";
import { getAll, put } from "../utils/db";

type State = {
  bets: Bet[];
  wallet: Wallet | null;
};

type Action =
  | { type: "SET_BETS"; bets: Bet[] }
  | { type: "ADD_BET"; bet: Bet }
  | { type: "SET_WALLET"; wallet: Wallet }
  | { type: "UPDATE_WALLET"; wallet: Wallet };

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
    case "SET_WALLET":
    case "UPDATE_WALLET":
      return { ...state, wallet: action.wallet };
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
      if (wallets.length > 0) dispatch({ type: "SET_WALLET", wallet: wallets[0] });
    })();
  }, []);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};