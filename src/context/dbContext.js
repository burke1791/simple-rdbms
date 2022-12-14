import React, { createContext, useContext, useReducer } from 'react';
import { getLocalStorage } from '../utilities';
import ContextSkeleton from './template';

const dbContext = new ContextSkeleton({ name: 'dbContext', storageEnabled: true });

const StateContext = createContext();
const DispatchContext = createContext();

function DbProvider({ children }) {
  const initialState = getLocalStorage('dbContext', JSON.parse) || {};
  const [state, dispatch] = useReducer(dbContext.contextReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useDbState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useDbState must be used within a DbProvider');
  }
  return context;
}

function useDbDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDbDispatch must be used within a DbProvider');
  }
  return context;
}

export { DbProvider, useDbState, useDbDispatch };