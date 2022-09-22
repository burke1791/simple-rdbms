import { BufferPool } from '../bufferPool';
import { getColumnDefinitionsByTableObjectId, getTableObjectByName } from '../system';

/**
 * @function
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @returns {Array<Array<ResultCell>>}
 */
export function executeSelect(buffer, queryTree) {
  if (queryTree.from.length > 1) throw new Error('Multi-table queries are not supported');

  // for some reason the sql parser doesn't understand that two-part naming refers to the schema and table
  const schemaName = queryTree.from[0].db || 'dbo';
  const tableName = queryTree.from[0].table;
  
  const objectRecord = getTableObjectByName(buffer, schemaName, tableName);
  const rootPageId = objectRecord.find(col => col.name.toLowerCase() === 'root_page_id').value;
  const tableObjectId = objectRecord.find(col => col.name.toLowerCase() === 'object_id').value;

  const columnDefinitions = getColumnDefinitionsByTableObjectId(buffer, tableObjectId);
  
  const results = buffer.pageScan(rootPageId, queryTree.where, columnDefinitions, []);

  const filteredResults = filterResultColumns(results, queryTree);

  const queryResult = {
    resultset: filteredResults,
    columnDefinitions: columnDefinitions
  };

  return queryResult;
}

/**
 * @functions
 * @param {Array<Array<ResultCell>>} results 
 * @param {SqlStatementTree} queryTree 
 * @returns {Array<Array<ResultCell>>}
 */
function filterResultColumns(results, queryTree) {
  if (queryTree.columns != '*') {
    const prunedResults = results.map(row => {
      const columns = row.columns.filter(col => {
        const matchedCol = queryTree.columns.find(res => res.expr.type == 'column_ref' && res.expr.column.toLowerCase() === col.name.toLowerCase());

        if (matchedCol == undefined) return false;
        return true;
      });

      return {
        ...row,
        columns: columns
      };
    });

    return prunedResults;
  }

  return results;
}