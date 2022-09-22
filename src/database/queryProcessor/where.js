
/**
 * @function
 * @param {Array<DataRecord>} results 
 * @param {Array<SqlWhereNode>} where
 * @returns {Array<DataRecord>}
 */
 export function filterResults(results, where) {
  if (where == null) return results;

  return results.filter(row => {
    return evaluateRow(row.columns, where);
  });
}

/**
 * @function
 * @param {Array<ResultCell>} row 
 * @param {Array<SqlWhereNode>} where 
 * @returns {Boolean}
 */
function evaluateRow(row, where) {
  // for (let node of where) {
  //   const isFiltered = evaluateSubtree(row, node);
  //   if (!isFiltered) return false;
  // }
  // return true;

  return evaluateSubtree(row, where);
}

/**
 * @function
 * @param {Array<ResultCell>} row 
 * @param {SqlWhereNode} where 
 * @returns {(Boolean|String|Number)}
 */
function evaluateSubtree(row, tree) {
  // console.trace();
  if (tree.type == 'column_ref') {
    const col = row.find(col => col.name.toLowerCase() === tree.column.toLowerCase());

    if (col == undefined) {
      console.log(tree);
      console.log(row);
      throw new Error('Unable to match tree (left) identifier to column');
    }

    return col.value === null ? null : `${col.value}`.toLowerCase();
  } else if (tree.type == 'number') {
    return `${tree.value}`;
  } else if (tree.type == 'string') {
    return tree.value.toLowerCase();
  } else if (tree.type == 'null') {
    return null;
  } else {
    const left = evaluateSubtree(row, tree.left);
    const right = evaluateSubtree(row, tree.right);

    switch (tree.operator.toLowerCase()) {
      case 'and':
        return left && right;
      case '=':
        return left == right;
      case 'is':
        return left === right;
      case 'is not':
        return left !== right;
      default:
        throw new Error('Unsupported predicate operation');
    }
  }
}