import React, { useState, useEffect } from 'react';
import { Table, Typography } from 'antd';
import { NOTIF, Pubsub, QUERY_TYPE } from '../../utilities';
import { useDbState } from '../../context';
import { useNavigate } from 'react-router-dom';
import ResultsTable from '../../components/resultsTable';

const { Text } = Typography;

function Results({ tableScroll = null }) {

  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, error, newData } = useDbState();

  const navigate = useNavigate();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.QUERY, Results, clearResults);

    return (() => {
      Pubsub.unsubscribe(NOTIF.QUERY, Results);
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
    <ResultsTable
      rowClassName='pointer'
      scroll={{ x: '100%', y: 'calc(50vh - 42px)' }}
      style={{ height: '50vh' }}
      onRowClick={() => navigate('/data-page')}
    />
  );
}

export default Results;