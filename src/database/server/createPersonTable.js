import { executeQuery } from '../queryProcessor';
import sqliteParser from 'sqlite-parser';

/**
 * @function
 * @param {BufferPool} buffer 
 * @returns {Boolean}
 */
export function createPersonTable(buffer) {
  const createQuery = `
    Create Table dbo.person (
      person_id Int Primary Key Autoincrement Not Null,
      first_name Varchar(100) Not Null,
      middle_name Varchar(100) Null,
      last_name Varchar(100) Not Null,
      age Int Not Null,
      height_inches SmallInt Null,
      weight_lbs Int Null
    )
  `;

  const tree = sqliteParser(createQuery);
  let queryTree;

  if (tree.type == 'statement' && tree.variant == 'list') {
    if (tree.statement.length > 1) {
      throw new Error('Only one query at a time is currently supported');
    } else {
      queryTree = tree.statement[0];
    }
  }

  console.log(queryTree);

  executeQuery(buffer, queryTree);
}