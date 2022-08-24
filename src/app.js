import React, { useEffect } from 'react';
import { Layout, Row } from 'antd';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { DbProvider } from './context';
import DbWrapper from './components/dbWrapper';
import { NOTIF, Pubsub } from './utilities';
import IDE from './pages/ide';
import PageViewer from './pages/pageViewer';

const { Sider, Content } = Layout;

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
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<IDE />} />
              <Route path='/viewer' element={<PageViewer />} />
            </Routes>
          </BrowserRouter>
        </Layout>
      </DbWrapper>
    </DbProvider>
  );
}

export default App;