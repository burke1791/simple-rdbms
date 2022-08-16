import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useWebsocketState } from '../../context';
import { WEBSOCKET_MESSAGE_TYPES } from '../../utilities';

function TableItems(props) {

  const [tables, setTables] = useState([]);

  const { socket, connected } = useWebsocketState();

  useEffect(() => {
    console.log(connected);
    if (connected) {
      socket.on(WEBSOCKET_MESSAGE_TYPES.FETCH_TABLES, handleTableResults);
      fetchTableList();
    }
  }, [connected]);

  const fetchTableList = () => {
    const query = `Select schema_name, object_name From sys.objects Where object_type_id = 1`;

    console.log('attempting to fetch table list');

    socket.emit(WEBSOCKET_MESSAGE_TYPES.FETCH_TABLES, query);
  }

  const handleTableResults = (data) => {
    console.log(data);
  }

  return (
    <Button
      type='primary'
      onClick={fetchTableList}
    >
      Fetch Tables
    </Button>
  );
}

export default TableItems;