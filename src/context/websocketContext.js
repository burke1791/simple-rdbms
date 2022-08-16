import React, { createContext, useReducer, useContext } from 'react';
import ContextSkeleton from './template';

const websocketContext = new ContextSkeleton('websocketContext', false);

const StateContext = createContext();
const DispatchContext = createContext();

function WebsocketProvider({ children }) {
  const [state, dispatch] = useReducer(websocketContext.contextReducer, {});

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useWebsocketState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useWebsocketState must be used within a WebsocketProvider');
  }
  return context;
}

function useWebsocketDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useWebsocketDispatch must be used within a WebsocketProvider');
  }
  return context;
}

export { WebsocketProvider, useWebsocketState, useWebsocketDispatch };