import React, { useEffect } from 'react';
import { Layout, Row } from 'antd';
import 'antd/dist/antd.css';

import { DbProvider } from './context';
import DbWrapper from './components/dbWrapper';
import { ObjectsPanel } from './panels/objects';
import { CodeEditor } from './panels/codeEditor';
import { NOTIF, Pubsub } from './utilities';

const { Sider, Content } = Layout;

function App() {

  useEffect(() => {
    document.addEventListener('keydown', disableF5);

    return (() => {
      document.removeEventListener('keydown');
    })
  }, []);

  const disableF5 = (e) => {
    if (e.which == 116) {
      e.preventDefault();
      Pubsub.publish(NOTIF.QUERY_F5, null);
    }
  }

  return (
    <DbProvider>
      <DbWrapper>
        <Layout style={{ height: '100vh' }}>
          <Sider>
            <ObjectsPanel />
          </Sider>
          <Layout>
            <Content>
              <Row>
                <CodeEditor />
              </Row>
              <Row>
                {/* Results Panel */}
              </Row>
            </Content>
          </Layout>
        </Layout>
      </DbWrapper>
    </DbProvider>
  );
}

export default App;