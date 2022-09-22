import { generateBlankPage } from "../bufferPool/serializer";
import { writePageToDisk } from "../storageEngine";
import { getNewSequenceInsertValues, getNextSequenceValue, _getNewColumnInsertValues, _getNewObjectInsertValues } from "../system";
import { STATIC_PAGE_IDS } from "../utilities/constants";

/**
 * @function
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @returns {Array<Array<ResultCell>>}
 */
export function executeCreate(buffer, queryTree) {
  const objectType = queryTree.keyword;

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

  const schemaName = queryTree.table[0].db || 'dbo';
  const tableName = queryTree.table[0].table;

  const newObjValues = _getNewObjectInsertValues(objectId, 1, false, schemaName, tableName, pageId, null);

  buffer.executeSystemObjectInsert(newObjValues);
  buffer.flushPageToDisk(STATIC_PAGE_IDS.OBJECTS);

  // Step 3
  const definitions = generateColumnDefinitions(queryTree.create_definitions);

  definitions.forEach(def => {
    const columnId = getNextSequenceValue(buffer, 4, 13);
    const values = _getNewColumnInsertValues(columnId, objectId, def.dataType, def.isVariable, def.isNullable, def.isPrimaryKey, def.maxLength, def.name, def.order);
    buffer.executeSystemColumnInsert(values);

    // Step 4
    if (def?.autoIncrement) {
      const seqId = getNextSequenceValue(buffer, 3, 8);
      const seqValues = getNewSequenceInsertValues(seqId, objectId, columnId, 1, 1);
      buffer.executeSystemSequenceInsert(seqValues);
    }
  });

  buffer.flushPageToDisk(STATIC_PAGE_IDS.SEQUENCES);
  buffer.flushPageToDisk(STATIC_PAGE_IDS.COLUMNS);

  return [];
}

/**
 * @function
 * @param {Array<SqlDefinitionNode>} definitions
 * @returns {Array<ColumnDefinition>}
 */
function generateColumnDefinitions(definitions) {
  return definitions.map((def, idx) => {
    const colDef = parseDefinitionNode(def);
    colDef.order = idx + 1;

    return colDef;
  });
}

/**
 * @function
 * @param {SqlDefinitionNode} node
 * @returns {ColumnDefinition}
 */
function parseDefinitionNode(node) {
  if (node.resource != 'column') throw new Error('Cannot parse definition');

  const def = {
    name: node.column.column,
    isVariable: false,
    isNullable: true,
    isPrimaryKey: false,
    maxLength: null
  };

  parseConstraints(def, node);

  switch (node.definition.dataType) {
    case 'TINYINT':
      def.dataType = 0;
      break;
    case 'SMALLINT':
      def.dataType = 1;
      break;
    case 'INT':
      def.dataType = 2;
      break;
    case 'BIGINT':
      def.dataType = 3;
      break;
    case 'BIT':
      def.dataType = 4;
      break;
    case 'CHAR':
      def.dataType = 5;
      def.maxLength = node.definition.length || 1;
      break;
    case 'VARCHAR':
      def.dataType = 6;
      def.isVariable = true;
      def.maxLength = node.definition.length || 30;
      break;
    default:
      throw new Error('Unsupported data type');
  }

  return def;
}

/**
 * @function
 * @param {ColumnDefinition} def 
 * @param {SqlDefinitionNode} node 
 */
function parseConstraints(def, node) {
  if (node.auto_increment) {
    def.autoIncrement = true;
  }

  if (node.unique_or_primary && node.unique_or_primary == 'primary key') {
    def.isPrimaryKey = true;
  }

  if (node.nullable.type == 'not null') {
    def.isNullable = false;
  }
}

/**
 * @function
 * @param {SqlDefinitionArgNode}
 */
function parseColumnLength(arg) {
  if (arg.type == 'expression' && arg.expression[0].type == 'literal') {
    return +arg.expression[0].value;
  } else {
    throw new Error('Unsupported column definition arg');
  }
}