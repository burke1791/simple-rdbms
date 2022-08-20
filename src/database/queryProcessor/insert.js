
/**
 * @function
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @param {('USER'|'SYSTEM')} requestor
 * @returns {Number}
 */
export function executeInsert(buffer, queryTree, requestor) {
  const table = queryTree.into.name.split('.');
  let schemaName;
  let tableName;

  if (table.length == 2) {
    schemaName = table[0];
    tableName = table[1]; 
  } else if (table.length == 1) {
    schemaName = 'dbo';
    tableName = table[0];
  }

  if (schemaName == 'sys' && requestor != 'SYSTEM') throw new Error('You cannot insert into system tables!');

  
}