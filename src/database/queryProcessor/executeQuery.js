import { BufferPool } from '../bufferPool';
import { executeCreate } from './create';
import { executeSelect } from './select';
import { executeUpdate } from './update';

/**
 * @function
 * @param {BufferPool} buffer
 * @param {SqlStatementTree} queryTree
 * @returns {Array<Array<ResultCell>>}
 */
export function executeQuery(buffer, queryTree) {
  let results;

  switch (queryTree.variant) {
    case 'select':
      results = executeSelect(buffer, queryTree);
      break;
    case 'create':
      results = executeCreate(buffer, queryTree);
      break;
    case 'update':
      const updateCount = executeUpdate(buffer, queryTree, 'USER');
      console.log('updateCount: ' + updateCount);
      results = [];
    default:
      throw new Error('This app only supports SELECT queries at the moment');
  }

  return results;
}