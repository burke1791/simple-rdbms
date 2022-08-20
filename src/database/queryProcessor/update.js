
/**
 * @function
 * Current allowing single-table queries only. Update operations follow these steps:
 * 1. Select * from the desired table with an optional predicate
 * 2. Update the deserialized records with their new values
 * 3. Reserialize the updated records and call buffer.updateRecords
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @param {('USER'|'SYSTEM')} requestor
 * @returns {Number}
 */
export function executeUpdate(buffer, queryTree, requestor) {
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

  if (schemaName == 'sys' && requestor !== 'SYSTEM') throw new Error('You cannot update system tables!');

  const objectRecord = getTableObjectByName(buffer, schemaName, tableName);
  const rootPageId = objectRecord.find(col => col.name.toLowerCase() === 'root_page_id').value;
  const tableObjectId = objectRecord.find(col => col.name.toLowerCase() === 'object_id').value;

  const columnDefinitions = getColumnDefinitionsByTableObjectId(buffer, tableObjectId);

  
}