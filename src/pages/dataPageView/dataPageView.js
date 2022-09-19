import React from 'react';
import { Button, Col, Layout, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResultsTable from '../../components/resultsTable';
import DataPagePanel from '../../panels/dataPagePanel/dataPagePanel';
import { useDbDispatch } from '../../context';

const { Content, Header } = Layout;

function DataPageView() {

  const navigate = useNavigate();

  const dbDispatch = useDbDispatch();

  const onCellHover = (record) => {
    dbDispatch({ type: 'update', key: 'pageId', value: record.__page_id });
    dbDispatch({ type: 'update', key: 'highlightRecordIndex', value: record.__record_index });
  }

  const returnToIde = () => {
    dbDispatch({ type: 'update', key: 'pageId', value: null });
    dbDispatch({ type: 'update', key: 'pageData', value: null });
    navigate('/');
  }

  return (
    <Content>
      <Header>
        <Button
          type='primary'
          onClick={returnToIde}
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
            onCellHover={onCellHover}
          />
        </Col>
      </Row>
    </Content>
  );
}

export default DataPageView;