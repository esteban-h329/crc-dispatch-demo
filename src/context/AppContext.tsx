import * as React from 'react';
import { ICall } from '../models';
import type { WebPartContext } from '../spfx-shims';

export interface IAppState {
  readonly activeCall: ICall | undefined;
  readonly callHistory: ReadonlyArray<ICall>;
  readonly isLoading: boolean;
  readonly error: string | undefined;
  readonly spContext: WebPartContext | undefined;
}

export type AppAction =
  | { readonly type: 'SET_ACTIVE_CALL'; readonly payload: ICall }
  | { readonly type: 'CLEAR_ACTIVE_CALL' }
  | { readonly type: 'UPDATE_ACTIVE_CALL'; readonly payload: Partial<ICall> }
  | { readonly type: 'ADD_CALL_TO_HISTORY'; readonly payload: ICall }
  | { readonly type: 'UPDATE_CALL_IN_HISTORY'; readonly payload: ICall }
  | { readonly type: 'REMOVE_CALL_FROM_HISTORY'; readonly payload: number }
  | { readonly type: 'SET_CALL_HISTORY'; readonly payload: ReadonlyArray<ICall> }
  | { readonly type: 'SET_LOADING'; readonly payload: boolean }
  | { readonly type: 'SET_ERROR'; readonly payload: string | undefined }
  | { readonly type: 'SET_SP_CONTEXT'; readonly payload: WebPartContext };

const initialState: IAppState = {
  activeCall: undefined,
  callHistory: [],
  isLoading: false,
  error: undefined,
  spContext: undefined,
};

export function appReducer(state: IAppState, action: AppAction): IAppState {
  switch (action.type) {
    case 'SET_ACTIVE_CALL':
      return { ...state, activeCall: action.payload, error: undefined };
    case 'CLEAR_ACTIVE_CALL':
      return { ...state, activeCall: undefined };
    case 'UPDATE_ACTIVE_CALL':
      if (state.activeCall === undefined) return state;
      return { ...state, activeCall: { ...state.activeCall, ...action.payload } };
    case 'ADD_CALL_TO_HISTORY':
      return { ...state, callHistory: [action.payload, ...state.callHistory] };
    case 'UPDATE_CALL_IN_HISTORY':
      return {
        ...state,
        callHistory: state.callHistory.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
      };
    case 'REMOVE_CALL_FROM_HISTORY':
      return {
        ...state,
        callHistory: state.callHistory.filter((c) => c.id !== action.payload),
      };
    case 'SET_CALL_HISTORY':
      return { ...state, callHistory: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SP_CONTEXT':
      return { ...state, spContext: action.payload };
    default:
      return state;
  }
}

interface IAppContextValue {
  readonly state: IAppState;
  readonly dispatch: React.Dispatch<AppAction>;
}

export const AppContext = React.createContext<IAppContextValue | undefined>(undefined);

interface IAppProviderProps {
  readonly children: React.ReactNode;
  readonly spContext: WebPartContext;
}

export const AppProvider: React.FC<IAppProviderProps> = ({ children, spContext }) => {
  const [state, dispatch] = React.useReducer(appReducer, {
    ...initialState,
    spContext,
  });

  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): IAppContextValue => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
