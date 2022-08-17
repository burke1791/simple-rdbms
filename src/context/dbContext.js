import React, { createContext, useContext, useReducer } from 'react';
import ContextSkeleton from './template';

const dbContext = new ContextSkeleton('dbContext', false);

const StateContext = createContext();
const DispatchContext = createContext();

function DbProvider({ children }) {
  const [state, dispatch] = useReducer(dbContext.contextReducer, {});

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