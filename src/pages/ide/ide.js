import React from 'react';
import { Layout, Row } from 'antd';
import { CodeEditor } from '../../panels/codeEditor';
import { ObjectsPanel } from '../../panels/objects';
import { EditorProvider } from '../../context/editorContext';
import ResultsTable from '../../components/resultsTable';
import { useNavigate } from 'react-router-dom';
import { useDbDispatch } from '../../context';
import InternalObjectToggle from '../../components/internalObjectToggle';


const { Sider, Content } = Layout;

function IDE() {

  const navigate = useNavigate();
  const dbDispatch = useDbDispatch();

  const toDataPageView = (record) => {
    // console.log(record);
    dbDispatch({ type: 'update', key: 'pageIdRequest', value: record.__page_id });
    dbDispatch({ type: 'update', key: 'pageIdRequestTrigger', value: new Date().valueOf() });
    navigate('/data-page');
  }

  return (
    <EditorProvider>
      <Sider>
        <ObjectsPanel />
        <InternalObjectToggle />
      </Sider>
      <Layout>
        <Content>
          <Row>
            <CodeEditor />
          </Row>
          <Row>
            <ResultsTable
              rowClassName='pointer'
              scroll={{ x: '100%', y: 'calc(50vh - 42px)' }}
              style={{ height: '50vh' }}
              onRowClick={toDataPageView}
            />
          </Row>
        </Content>
      </Layout>
    </EditorProvider>
  );
}

export default IDE;