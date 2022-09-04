import React from 'react';
import { Button, Col, Layout, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResultsTable from '../../components/resultsTable';
import DataPagePanel from '../../panels/dataPagePanel/dataPagePanel';

const { Content, Header } = Layout;

function DataPageView() {

  const navigate = useNavigate();

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
        <Col span={12} style={{ height: 'calc(100vh - 64px)', overflowY: 'scroll' }}>
          <DataPagePanel />
        </Col>
        <Col span={12} style={{ height: 'calc(100vh - 64px)', overflowY: 'scroll' }}>
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