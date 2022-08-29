import React, { Fragment } from 'react';
import { Layout, Row } from 'antd';
import { CodeEditor } from '../../panels/codeEditor';
import { ObjectsPanel } from '../../panels/objects';
import { EditorProvider } from '../../context/editorContext';
import { Results } from '../../panels/results';


const { Sider, Content } = Layout;

function IDE() {

  return (
    <Fragment>
      <Sider>
        <ObjectsPanel />  
      </Sider>
      <Layout>
        <Content>
          <Row>
            <EditorProvider>
              <CodeEditor />
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

export default IDE;