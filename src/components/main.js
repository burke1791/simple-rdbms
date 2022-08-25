import React, { Fragment } from 'react';
import { Layout, Row } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CodeEditor } from '../panels/codeEditor';
import { ObjectsPanel } from '../panels/objects';
import { Results } from '../panels/results';
import { EditorProvider } from '../context/editorContext';
import { DataPageViewer } from '../panels/dataPageViewer';
import { useDbState } from '../context';
import { VIEW_MODE } from '../utilities';

const { Sider, Content } = Layout;

function Main() {

  const { viewMode } = useDbState();

  const generateTopPanel = () => {
    if (viewMode == VIEW_MODE.PAGE_VIEWER) {
      return <DataPageViewer />;
    }

    return <CodeEditor />;
  }

  return (
    <Fragment>
      <Sider>
        <ObjectsPanel />  
      </Sider>
      <Layout>
        <Content>
          <Row>
            <EditorProvider>
              {generateTopPanel()}
            </EditorProvider>
          </Row>
          <Row>
            <Results />
          </Row>
        </Content>
      </Layout>
    </Fragment>
  );
}

export default Main;