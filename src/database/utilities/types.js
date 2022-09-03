
/**
 * @typedef ColumnValue
 * @property {String} name
 * @property {(String|Number|Boolean)} value
 * @property {Number} [order]
 */

/**
 * @typedef Record
 * @property {Array<ColumnValue>}
 */

/**
 * @typedef DataRecord
 * @property {Array<ColumnValue>} columns
 * @property {Number} __page_id
 */

/**
 * @typedef SimplePredicate
 * @property {String} colName
 * @property {(String|Number|Boolean)} colValue
 */

/**
 * @typedef ResultCell
 * @property {String} name
 * @property {(String|Number|Boolean)} value
 * @property {Number} order
 */

/**
 * @typedef ColumnDefinition
 * @property {String} name,
 * @property {Number} dataType
 * @property {Boolean} isVariable
 * @property {Boolean} isNullable
 * @property {Boolean} isPrimaryKey
 * @property {Number} [maxLength]
 * @property {Number} order
 */

/**
 * @typedef QueryTable
 * @property {String} schemaName
 * @property {String} tableName
 */

/**
 * @typedef Query
 * @property {('select'|'update'|'delete')} type
 * @property {Array<String>} columns
 * @property {QueryTable} from
 * @property {Array<SimplePredicate>} where
 */