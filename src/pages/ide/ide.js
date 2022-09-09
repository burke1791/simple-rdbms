import React, { Fragment } from 'react';
import { Layout, Row } from 'antd';
import { CodeEditor } from '../../panels/codeEditor';
import { ObjectsPanel } from '../../panels/objects';
import { EditorProvider } from '../../context/editorContext';
import ResultsTable from '../../components/resultsTable';
import { useNavigate } from 'react-router-dom';
import { useDbDispatch } from '../../context';


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
            <ResultsTable
              rowClassName='pointer'
              scroll={{ x: '100%', y: 'calc(50vh - 42px)' }}
              style={{ height: '50vh' }}
              onRowClick={toDataPageView}
            />
          </Row>
        </Content>
      </Layout>
    </Fragment>
  );
}

export default IDE;