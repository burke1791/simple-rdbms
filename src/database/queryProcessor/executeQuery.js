import { BufferPool } from '../bufferPool';
import { executeSelect } from './select';

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
    default:
      throw new Error('This app only supports SELECT queries at the moment');
  }

  return results;
}