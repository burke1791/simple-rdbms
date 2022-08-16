import React, { useState, useEffect } from 'react';
import { Button, Layout } from 'antd';
import 'antd/dist/antd.css';

import io from 'socket.io-client';
import { WebsocketProvider } from './context';
import { ConnectionsPanel } from './panels/connections';
import TableItems from './panels/connections/tableItems';

const { Sider, Content } = Layout;

function App() {

  return (
    <WebsocketProvider>
      <Layout style={{ height: '100vh' }}>
        <Sider>
          <ConnectionsPanel />
        </Sider>
        <Layout>
          <Content>
            <TableItems />
          </Content>
        </Layout>
      </Layout>
    </WebsocketProvider>
  );
}

export default App;