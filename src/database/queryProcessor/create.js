
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
    3. If the table has an autoincremented primary key, Insert a new record into the sequences table using the next sequence_id sequence
      3a. Increment the sequence_id sequence
    4. Insert a new record into the columns table for each column in the table definition
      4a. Increment the column_id sequence as the records are inserted
  */

  
}