import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import { useDbState } from '../context';
import { NOTIF, Pubsub, QUERY_TYPE } from '../utilities';

const { Text } = Typography;

/**
 * @typedef ResultsTableProps
 * @property {String} [rowClassName]
 * @property {Object} [scroll]
 * @property {Object} [style]
 * @property {Function} [onRowClick]
 */

/**
 * @component
 * @param {ResultsTableProps} props 
 */
function ResultsTable(props) {

  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, error, newData } = useDbState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.QUERY, ResultsTable, clearResults);

    return (() => {
      Pubsub.unsubscribe(NOTIF.QUERY, ResultsTable);
    })
  }, []);

  useEffect(() => {
    if (newData && !error) {
      populateResults();
    } else if (error) {
      setLoading(false);
    }
  }, [newData]);

  const clearResults = (query) => {
    if (query.type == QUERY_TYPE.USER) {
      setResults([]);
      setLoading(true);
    }
  }

  const populateResults = () => {
    generateColumns();
    const resultset = data.map((row, i) => {
      const columns = row.sort((a, b) => a.order - b.order);

      const data = {
        _recordNum: i + 1
      };

      for (let col of columns) {
        data[col.name] = col.value;
      }

      return data;
    });

    setResults(resultset);
    setLoading(false);
  }

  const generateColumns = () => {
    if (data && data.length > 0) {
      const cols = data[0].map(col => {
        return {
          align: 'left',
          dataIndex: col.name,
          title: <Text code ellipsis>{col.name}</Text>,
          width: 175,
          render: (text) => {
            let value = text;
            if (typeof text == 'boolean') {
              value = text ? 'true' : 'false';
            }
            return <Text ellipsis>{value}</Text>;
          }
        };
      });

      setColumns(cols);
    } else {
      setColumns([]);
    }
  }

  return (
    <Table
      bordered
      pagination={false}
      rowKey='_recordNum'
      rowClassName={props.rowClassName}
      columns={columns}
      dataSource={results}
      loading={loading}
      size='small'
      scroll={props.scroll}
      style={props.style}
      onRow={(record) => {
        return {
          onClick: props.onRowClick
        }
      }}
    />
  );
}

export default ResultsTable;