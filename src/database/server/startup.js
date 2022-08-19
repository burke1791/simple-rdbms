import { BufferPool } from '../bufferPool';
import { fileExists } from '../storageEngine/reader';
import { initColumnsTableDefinition, initializeColumnsTable, initializeObjectsTable, initializeSequencesTable, initObjectsTableDefinition, initSequencesTableDefinition } from '../system';

/**
 * @function
 * @param {BufferPool} buffer 
 * @returns {Boolean}
 */
export function startup(buffer) {
  console.log('Starting DB Server...');

  try {
    if (!fileExists('data')) {
      console.log('First startup, initializing DB...');
      initializeObjectsTable(buffer);
      initializeSequencesTable(buffer);
      initializeColumnsTable(buffer);

      initObjectsTableDefinition(buffer, 1);
      initSequencesTableDefinition(buffer, 8);
      initColumnsTableDefinition(buffer, 12);

      buffer.flushAll();
    }

    buffer.loadPageIntoMemory('data', 1);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}