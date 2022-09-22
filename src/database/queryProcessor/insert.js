import { getColumnDefinitionsByTableObjectId, getNextSequenceValue, getTableObjectByName } from "../system";

/**
 * @function
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @param {('USER'|'SYSTEM')} requestor
 * @returns {Number}
 */
export function executeInsert(buffer, queryTree, requestor) {
  /*
    Perform the following actions:
    
    1. Parse query tree
    2. Perform validation on the inserted columns
      2a. Columns exist
      2b. Constraints are satisfied (null/not null, fkey, pkey)
      2c. Don't allow inserts into autoIncremented columns
    3. Loop through inserted records and add them to the page
      3a. Serialize record
      3b. Call page.addRecordToPage
    
  */

  // Setp 1
  const values = queryTree.values.map(row => {
    const columns = [];
    for (let i in row.value) {
      let value;

      const type = row.value[i].type

      switch (type) {
        case 'null':
          value = null;
          break;
        default:
          value = row.value[i].value;
      }

      columns.push({
        name: queryTree.columns[i],
        value: value
      });
    }
    return columns;
  });

  console.log(queryTree);
  console.log(values);

  // Step 2
  const schemaName = queryTree.table[0].db || 'dbo';
  const tableName = queryTree.table[0].table;

  if (schemaName == 'sys' && requestor != 'SYSTEM') throw new Error('You cannot insert into system tables!');

  const objectRecord = getTableObjectByName(buffer, schemaName, tableName);
  const rootPageId = objectRecord.find(col => col.name.toLowerCase() === 'root_page_id').value;
  const tableObjectId = objectRecord.find(col => col.name.toLowerCase() === 'object_id').value;

  const columnDefinitions = getColumnDefinitionsByTableObjectId(buffer, tableObjectId);

  console.log(columnDefinitions);

  // Step 2a
  for (let col of values[0]) {
    const def = columnDefinitions.find(colDef => colDef.name == col.name);

    if (def == undefined) throw new Error('Column: ' + col.name + ' does not exist');
  }

  // Step 2c
  const autoIncCols = columnDefinitions.filter(colDef => colDef.autoIncrement);

  for (let col of values[0]) {
    if (autoIncCols.some(c => c.name == col.name)) throw new Error('Cannot insert into autoincremented column');
  }

  // Step 3
  if (autoIncCols.length > 0) {
    for (let row of values) {
      for (let col of autoIncCols) {
        const nextSeq = getNextSequenceValue(buffer, tableObjectId, col.columnId);
        row.push({
          name: col.name,
          value: nextSeq
        });
      }
    }
  }

  // Step 4
  return buffer.insertRecords(rootPageId, values, columnDefinitions);
}