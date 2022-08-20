import { generateBlankPage } from "../bufferPool/serializer";
import { writePageToDisk } from "../storageEngine";
import { getNextSequenceValue, _getNewObjectInsertValues } from "../system";

/**
 * @function
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @returns {Array<Array<ResultCell>>}
 */
export function executeCreate(buffer, queryTree) {
  const objectType = queryTree.format;

  switch (objectType) {
    case 'table':
      return createTable(buffer, queryTree);
    default:
      throw new Error('This app only supports creating tables');
  }
}

/**
 * @function
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @returns {Array<Array<ResultCell>>}
 */
function createTable(buffer, queryTree) {
  /*
    Perform the following actions:
    
    1. generate a blank page using the next page_id sequence
      1a. Increment the page_id sequence
    2. Insert a new record into the objects table using the next object_id sequence
      2a. Increment the object_id sequence
    3. Insert a new record into the columns table for each column in the table definition
      3a. Increment the column_id sequence as the records are inserted
    4. If the table has an autoincremented primary key, Insert a new record into the sequences table using the next sequence_id sequence
      4a. Increment the sequence_id sequence
    
  */

  // Step 1
  const pageId = getNextSequenceValue(buffer, 1, null);
  const newPage = generateBlankPage(1, pageId, 1);
  writePageToDisk('data', newPage);
  buffer.loadPageIntoMemory('data', pageId);

  // Step 2
  const objectId = getNextSequenceValue(buffer, 2, 1);

  const table = queryTree.name.name.split('.');
  let schemaName;
  let tableName;

  if (table.length == 2) {
    schemaName = table[0];
    tableName = table[1]; 
  } else if (table.length == 1) {
    schemaName = 'dbo';
    tableName = table[0];
  }

  const newObjValues = _getNewObjectInsertValues(objectId, 1, false, schemaName, tableName, pageId, null);

  buffer.executeSystemObjectInsert(newObjValues);

  // Step 3

}

/**
 * @function
 */
function generateColumnDefinitions()