import { serializeRecord } from '../bufferPool/serializer';
import { getColumnDefinitionsByTableObjectId, getTableObjectByName } from '../system';

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
  if (queryTree.table.length > 1) throw new Error('Unable to perform this update operation');

  const schemaName = queryTree.table[0].db || 'dbo';
  const tableName = queryTree.table[0].table;

  if (schemaName == 'sys' && requestor !== 'SYSTEM') throw new Error('You cannot update system tables!');

  const objectRecord = getTableObjectByName(buffer, schemaName, tableName);
  const rootPageId = objectRecord.find(col => col.name.toLowerCase() === 'root_page_id').value;
  const tableObjectId = objectRecord.find(col => col.name.toLowerCase() === 'object_id').value;

  const columnDefinitions = getColumnDefinitionsByTableObjectId(buffer, tableObjectId);
  const pkName = columnDefinitions.find(def => def.isPrimaryKey).name;

  const results = buffer.pageScan(rootPageId, queryTree.where, columnDefinitions, []);

  const updatedRows = results.map(row => {
    return row.columns.map(col => {
      const updNode = getUpdateNode(col.name, queryTree.set);
      if (updNode != null) {
        col.value = computeUpdateValue(updNode, row.columns);
      }

      return col;
    });
  });

  console.log(updatedRows);

  const updatedRecords = updatedRows.map(row => {
    const pk = row.find(col => col.name == pkName);
    return {
      primaryKeyName: pkName,
      primaryKeyValue: pk.value,
      serializedRecord: serializeRecord(row, columnDefinitions)
    };
  });

  const numRecordsUpdated = buffer.updateRecords(rootPageId, updatedRecords, columnDefinitions);

  return numRecordsUpdated;
}

/**
 * @function
 * @param {String} colName 
 * @param {Array<SqlSetNode>} setNodes
 * @returns {SqlSetValueNode}
 */
function getUpdateNode(colName, setNodes) {
  for (let node of setNodes) {
    if (node.column.toLowerCase() == colName.toLowerCase()) return node.value;
  }

  return null;
}

/**
 * @function
 * @param {SqlSetValueNode} node 
 * @param {Array<ResultCell>} row 
 */
function computeUpdateValue(node, row) {
  if (node.type == 'literal') {
    let value;
    switch (node.variant) {
      case 'decimal':
        value = Number(node.value);
        break;
      case 'text':
        value = node.value;
        break;
      case 'null':
        value = null;
        break;
      default:
        throw new Error('Invalid update value node variant');
    }

    return value;
  } else if (node.type == 'string') {
    return node.value;
  } else if (node.type == 'column_ref') {
    const name = node.column;
    const col = row.find(c => c.name == name);

    if (col == undefined) throw new Error('referenced column not found');

    return col.value;
  } else if (node.type == 'binary_expr') {
    const left = computeUpdateValue(node.left, row);
    const right = computeUpdateValue(node.right, row);

    switch (node.operator) {
      case '+':
        return +left + +right;
      case '-':
        return +left - +right;
      case '*':
        return +left * +right;
      case '/':
        return +left / +right;
      default:
        throw new Error('Unsupported update operation');
    }
  }
}