import React, { createContext, useContext, useReducer } from 'react';
import { getLocalStorage } from '../utilities';
import ContextSkeleton from './template';

const dbContext = new ContextSkeleton({ name: 'dbConnectionContext', storageEnabled: true });

const StateContext = createContext();
const DispatchContext = createContext();

function DbConnectionProvider({ children }) {
  const [state, dispatch] = useReducer(dbContext.contextReducer, {});

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useDbConnectionState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useDbState must be used within a DbConnectionProvider');
  }
  return context;
}

function useDbConnectionDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDbDispatch must be used within a DbConnectionProvider');
  }
  return context;
}

export { DbConnectionProvider, useDbConnectionState, useDbConnectionDispatch };