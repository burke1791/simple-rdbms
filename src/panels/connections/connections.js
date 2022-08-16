import React, { useEffect } from 'react';
import { Menu } from 'antd';
import { io } from 'socket.io-client';
import { useWebsocketDispatch, useWebsocketState } from '../../context';

function ConnectionsPanel(props) {

  console.log(process.env);

  useEffect(() => {
    connect();

    return (() => {
      disconnect();
    });
  }, []);

  const { socket, connected } = useWebsocketState();

  const websocketDispatch = useWebsocketDispatch();

  const connect = () => {
    const socket = io(process.env.SRDBMS_WEBSOCKET_URI);

    socket.on('connect', () => {
      console.log('connected');
      websocketDispatch({ type: 'update', key: 'connected', value: true });
    });

    socket.on('disconnect', () => {
      console.log('connection closed');
      websocketDispatch({ type: 'update', key: 'connected', value: false });
    });

    websocketDispatch({ type: 'update', key: 'socket', value: socket });
  }

  const disconnect = () => {
    if (connected) {
      socket.close();
    }
  }

  return (
    <Menu
      mode='inline'
      style={{ width: 256 }}
      items={props.children}
    />
  );
}

export default ConnectionsPanel;