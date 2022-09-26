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

  executeQuery(buffer, queryTree);
}

export function insertDummyPersonData(buffer) {
  const query = `
    Insert Into dbo.Person (FirstName, MiddleName, LastName, Age, HeightInches, Weight)
    Values
    ('Chris', 'John', 'Burke', 31, 76, 190),
    ('Max', 'David', 'Wichmer', 32, Null, Null),
    ('Christina', Null, 'Wichmer', 32, Null, Null)
  `

  const tree = parser.astify(query, parserConfig);

  const queryTree = extractSingleQueryTree(tree);

  executeQuery(buffer, queryTree);
}