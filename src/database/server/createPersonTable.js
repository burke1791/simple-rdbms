import { executeQuery } from '../queryProcessor';
import { Parser } from 'node-sql-parser';
import { extractSingleQueryTree } from '../queryProcessor/treeParser';

const parser = new Parser();

const parserConfig = {
  database: 'TransactSQL'
};

/**
 * @function
 * @param {BufferPool} buffer 
 * @returns {Boolean}
 */
export function createPersonTable(buffer) {
  const createQuery = `
    Create Table dbo.Person (
      PersonId Int Not Null Identity(1, 1) Primary Key,
      FirstName Varchar(100) Not Null,
      MiddleName Varchar(100) Null,
      LastName Varchar(100) Not Null,
      Age Int Not Null,
      HeightInches SmallInt Null,
      Weight Int Null
    )
  `;

  const tree = parser.astify(createQuery, parserConfig);

  const queryTree = extractSingleQueryTree(tree);

  console.log(queryTree);

  executeQuery(buffer, queryTree);
}