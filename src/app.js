import React, { useEffect } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { DbProvider } from './context';
import DbWrapper from './components/dbWrapper';
import { NOTIF, Pubsub } from './utilities';
import Main from './components/main';
import './app.css';

function App() {

  useEffect(() => {
    document.addEventListener('keydown', disableF5);

    return (() => {
      document.removeEventListener('keydown');
    })
  }, []);

  const disableF5 = (e) => {
    if (e.which == 116 || (e.metaKey && e.which == 69)) {
      e.preventDefault();
      Pubsub.publish(NOTIF.QUERY_F5, null);
    }
  }

  return (
    <DbProvider>
      <DbWrapper>
        <Layout style={{ height: '100vh' }}>
          <Main />
        </Layout>
      </DbWrapper>
    </DbProvider>
  );
}

export default App;