import { filterResults } from '../queryProcessor';
import { writePageToDisk, readPageFromDisk } from '../storageEngine';
import { columnsTableDefinition, getColumnDefinitionsByTableObjectId } from '../system/columns';
import { getTableObjectByName, objectsTableDefinition } from '../system/objects';
import { sequencesTableDefinition } from '../system/sequences';
import { getHeaderValue } from './deserializer';
import Page from './page';
import { serializeRecord } from './serializer';

/**
 * @class
 * @param {Number} maxPageCount
 */
function BufferPool(maxPageCount) {

  this.pages = {};
  this.pageCount = 0;
  this.maxPageCount = maxPageCount;

  this.loadPageIntoMemory = (filename, pageId) => {
    const pageData = readPageFromDisk(filename, pageId);
    const page = new Page();

    page.initPageFromDisk(pageData);
    this.pages[pageId] = page;

    this.pageCount++;
  }

  this.flushPageToDisk = (pageId) => {
    const page = this.pages[pageId];
    const isWritten = writePageToDisk('data', page.data);

    if (!isWritten) {
      console.log('Error writing pageId: ' + pageId);
    }
  }

  this.flushAll = () => {
    const pageIds = Object.keys(this.pages);

    for (let pageId of pageIds) {
      const page = this.pages[pageId];
      const isWritten = writePageToDisk('data', page.data);

      if (!isWritten) {
        console.log('Error writing pageId: ' + pageId);
      }
    }
  }

  /**
   * @method
   * @param {Number} pageId 
   * @param {Array<SimplePredicate>} predicate
   * @param {Array<ColumnDefinition>} columnDefinitions
   * @param {Array<Array<ResultCell>>} [results]
   * @returns {{Array<Array<ResultCell>>}}
   */
  this.scan = (pageId, predicate, columnDefinitions, results = []) => {
    if (this.pages[pageId] == undefined) {
      this.loadPageIntoMemory('data', pageId);
    }

    const page = this.pages[pageId];

    if (getHeaderValue('pageType', page.header) == '2') {
      throw new Error('Index pages are not supported yet!');
    } else {
      results.push(...page.select(predicate, columnDefinitions));
      return results;
    }
  }

  /**
   * @method
   * @param {Number} pageId 
   * @param {Array<SqlWhereNode>} predicate
   * @param {Array<ColumnDefinition>} columnDefinitions
   * @param {Array<Array<ResultCell>>} [results]
   * @returns {{Array<Array<ResultCell>>}}
   */
  this.pageScan = (pageId, where, columnDefinitions, results = []) => {
    if (this.pages[pageId] == undefined) {
      this.loadPageIntoMemory('data', pageId);
    }

    const page = this.pages[pageId];

    if (getHeaderValue('pageType', page.header) == '2') {
      throw new Error('Index pages are not supported yet!');
    } else {
      results.push(...page.readPage(columnDefinitions));
      const filteredResults = filterResults(results, where);
      return filteredResults;
    }
  }

  /**
   * @method
   * @param {String} schemaName 
   * @param {String} tableName 
   * @param {Array<SimplePredicate>} predicate 
   * @returns {Array<Array<ResultCell>>}
   */
  this.executeSelect = (schemaName, tableName, predicate) => {
    /*
      1. Find the root_page_id for the provided [schema].[table] from the system objects table
      2. Scan the page for records while evaluating the predicate
    */

    const objectRecord = getTableObjectByName(this, schemaName, tableName);
    const rootPageId = objectRecord.find(col => col.name.toLowerCase() === 'root_page_id').value;
    const tableObjectId = objectRecord.find(col => col.name.toLowerCase() === 'object_id').value;

    const columnDefinitions = getColumnDefinitionsByTableObjectId(this, tableObjectId);
    
    const results = this.scan(rootPageId, predicate, columnDefinitions, results);

    return results;
  }

  this.executeSelectQuery = (from, where) => {
    /*
      Currently allowing single-table queries only
    */

    const table = from.name.split('.');
    let schemaName;
    let tableName;

    if (table.length == 2) {
      schemaName = table[0];
      tableName = table[1]; 
    } else if (table.length == 1) {
      schemaName = 'dbo';
      tableName = table[0];
    }
    
    const objectRecord = getTableObjectByName(this, schemaName, tableName);
    const rootPageId = objectRecord.find(col => col.name.toLowerCase() === 'root_page_id').value;
    const tableObjectId = objectRecord.find(col => col.name.toLowerCase() === 'object_id').value;

    const columnDefinitions = getColumnDefinitionsByTableObjectId(this, tableObjectId);
    
    const results = this.pageScan(rootPageId, where, columnDefinitions, results);

    return results;
  }

  /**
   * @function
   * @param {SqlStatementTree} query 
   * @returns {Array<Array<ResultCell>>}
   */
  this.executeQuery = (query) => {
    const predicate = query.where || [];

    let results;

    // assuming a 'statement' type
    switch (query.variant) {
      case 'select':
        results = this.executeSelectQuery(query.from, predicate);
        break;
      default:
        throw new Error('We only support SELECT queries at the moment');
    }

    // prune columns not defined in the query object
    if (query.result[0].variant != 'star') {
      const prunedResults = results.map(row => {
        const columns = row.filter(col => {
          const matchedCol = query.result.find(res => res.type == 'identifier' && res.name === col.name.toLowerCase());

          if (matchedCol == undefined) return false;
          return true;
        });

        return columns;
      });

      return prunedResults;
    }

    return results;
  }

  /**
   * @method
   * @param {Array<ColumnValue>}
   */
  this.executeSystemObjectInsert = (values) => {
    /**
     * @todo PK check
     */

    const serializedRecord = serializeRecord(values, objectsTableDefinition);

    if (!this.pages[1].hasAvailableSpace(serializedRecord)) {
      throw new Error('Objects page does not have enough space and we cannot do page splits yet');
    }

    this.pages[1].addRecordToPage(serializedRecord);
  }

  /**
   * @method
   * @param {Array<ColumnValue>}
   */
   this.executeSystemSequenceInsert = (values) => {
    /**
     * @todo PK check
     */

    const serializedRecord = serializeRecord(values, sequencesTableDefinition);

    if (!this.pages[2].hasAvailableSpace(serializedRecord)) {
      throw new Error('Sequences page does not have enough space and we cannot do page splits yet');
    }

    this.pages[2].addRecordToPage(serializedRecord);
  }

  /**
   * @method
   * @param {Array<ColumnValue>}
   */
   this.executeSystemColumnInsert = (values) => {
    /**
     * @todo PK check
     */

    const serializedRecord = serializeRecord(values, columnsTableDefinition);

    if (!this.pages[3].hasAvailableSpace(serializedRecord)) {
      throw new Error('Sequences page does not have enough space and we cannot do page splits yet');
    }

    this.pages[3].addRecordToPage(serializedRecord);
  }

}

export default BufferPool;