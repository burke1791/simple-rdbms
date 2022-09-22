
/**
 * @function
 * @param {(Object|Array)} tree 
 * @returns {Object}
 */
export function extractSingleQueryTree(tree) {
  let queryTree;

  if (Array.isArray(tree) && tree.length > 1) {
    throw new Error('Only one query at a time is currently supported');
  } else if (Array.isArray(tree)) {
    queryTree = tree[0];
  } else {
    queryTree = tree;
  }

  return queryTree;
}