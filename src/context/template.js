// import React, { createContext, useReducer, useContext } from 'react';
import { clearLocalStorage, getLocalStorage, setLocalStorage } from '../utilities';

/**
 * Extensible skeleton function for use by multiple different contexts
 * @constructor ContextSkeleton
 * @param {Object} config - config object
 * @param {String} config.name - human-readable name for the context class
 * @param {Boolean} config.storageEnabled - whether or not you want the context data replicated to localstorage
 */
function ContextSkeleton({ name, storageEnabled }) {

  const contextName = name;
  const localstorageEnabled = !!storageEnabled;

  function contextReducer(state, action) {
    switch (action.type) {
      case 'update': {
        if (localstorageEnabled) {
          setContextStorage(state, action);
        }

        return {
          ...state,
          [action.key]: action.value
        };
      }
      case 'clear': {
        if (localstorageEnabled) {
          clearContextStorage();
        }

        return {};
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type} in context: ${contextName}`);
      }
    }
  }

  function setContextStorage(state, action) {
    let contextState = {
      ...state,
      [action.key]: action.value
    };

    setLocalStorage(contextName, contextState);
  }

  function getContextStorage() {
    const contextState = getLocalStorage(contextName, JSON.parse);

    return contextState === null ? {} : contextState;
  }

  function clearContextStorage() {
    clearLocalStorage();
  }

  return {
    contextReducer
  };
}

export default ContextSkeleton;