
/**
 * @function
 * @param {String} key 
 * @param {Function} parser 
 * @returns {any}
 */
export function getLocalStorage(key, parser) {
  const data = localStorage.getItem(key);

  if (parser != undefined) {
    return parser(data);
  }

  return data;
}

/**
 * @function
 * @param {String} key 
 * @param {any} data 
 */
export function setLocalStorage(key, data) {
  const stringifiedData = JSON.stringify(data);
  localStorage.setItem(key, stringifiedData);
}

/**
 * @function
 */
export function clearLocalStorage() {
  localStorage.clear();
}