import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import { NOTIF, Pubsub, QUERY_TYPE } from '../../utilities';
import { useDbState } from '../../context';

const { Text } = Typography;

function Results() {

  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, newData } = useDbState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.QUERY, Results, clearResults);

    return (() => {
      Pubsub.unsubscribe(NOTIF.QUERY, Results);
    })
  }, []);

  useEffect(() => {
    if (newData) {
      populateResults();
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

    console.log(resultset);

    setResults(resultset);
    setLoading(false);
  }

  const generateColumns = () => {
    if (data && data.length > 0) {
      const cols = data[0].map(col => {
        console.log(col);
        return {
          align: 'left',
          dataIndex: col.name,
          title: <Text code ellipsis>{col.name}</Text>,
          width: 250
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
      columns={columns}
      dataSource={results}
      loading={loading}
      size='small'
      scroll={{ x: true, y: 'calc(50vh - 42px)' }}
      style={{ height: '50vh' }}
    />
  );
}

export default Results;