import React, { createContext, useContext, useReducer } from 'react';
import { getLocalStorage } from '../utilities';
import ContextSkeleton from './template';

const editorContext = new ContextSkeleton({ name: 'editorContext', storageEnabled: true });

const StateContext = createContext();
const DispatchContext = createContext();

function EditorProvider({ children }) {
  const initialState = getLocalStorage('editorContext', JSON.parse) || {};
  const [state, dispatch] = useReducer(editorContext.contextReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useEditorState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useEditorState must be used within an EditorProvider');
  }
  return context;
}

function useEditorDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useEditorDispatch must be used within an EditorProvider');
  }
  return context;
}

export { EditorProvider, useEditorState, useEditorDispatch };