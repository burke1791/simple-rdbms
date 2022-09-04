import React, { useEffect } from 'react';
import { Button, Col, Layout, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDbDispatch, useDbState } from '../../context';
import ResultsTable from '../../components/resultsTable';
import DataPagePanel from '../../panels/dataPagePanel/dataPagePanel';

const { Content, Header } = Layout;

function DataPageView() {

  const { pageData, pageDataTrigger } = useDbState();

  const navigate = useNavigate();

  const dbDispatch = useDbDispatch();

  useEffect(() => {
    dbDispatch({ type: 'update', key: 'pageIdRequest', value: 4 });
    dbDispatch({ type: 'update', key: 'pageIdRequestTrigger', value: new Date().valueOf() });
  }, []);

  useEffect(() => {
    if (pageDataTrigger) {
      // console.log(pageData);
    }
  }, [pageDataTrigger]);

  return (
    <Content>
      <Header>
        <Button
          type='primary'
          onClick={() => navigate('/')}
        >
          Back to IDE
        </Button>
      </Header>
      <Row>
        <Col span={12}>
          <DataPagePanel />
        </Col>
        <Col span={12}>
          <ResultsTable
            rowClassName='pointer'
            scroll={{ x: '100%', y: '100%' }}
          />
        </Col>
      </Row>
    </Content>
  );
}

export default DataPageView;