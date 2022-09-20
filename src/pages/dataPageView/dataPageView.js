import React from 'react';
import { Button, Col, Layout, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import ResultsTable from '../../components/resultsTable';
import DataPagePanel from '../../panels/dataPagePanel/dataPagePanel';
import { useDbDispatch, useDbState } from '../../context';

const { Content, Header } = Layout;

function DataPageView() {

  const navigate = useNavigate();

  const dbDispatch = useDbDispatch();
  const { highlightRecordIndex, stickyHighlightRecordIndex } = useDbState();

  const onCellHover = (record) => {
    dbDispatch({ type: 'update', key: 'pageId', value: record.__page_id });
    dbDispatch({ type: 'update', key: 'highlightRecordIndex', value: record.__record_index });
  }

  const returnToIde = () => {
    dbDispatch({ type: 'update', key: 'pageId', value: null });
    dbDispatch({ type: 'update', key: 'pageData', value: null });
    navigate('/');
  }

  const rowClicked = (record) => {
    let updatedIndex = null;
    if (stickyHighlightRecordIndex != record.__record_index) {
      updatedIndex = record.__record_index;
    }
    dbDispatch({ type: 'update', key: 'stickyHighlightRecordIndex', value: updatedIndex });
  }

  const getRowClassName = (record) => {
    let className = 'pointer';

    if (record.__record_index == highlightRecordIndex) {
      className += ' hover';
    } else if (record.__record_index == stickyHighlightRecordIndex) {
      className += ' sticky-hover';
    }

    return className;
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
            rowClassName={getRowClassName}
            scroll={{ x: '100%', y: '100%' }}
            onCellHover={onCellHover}
            onRowClick={rowClicked}
          />
        </Col>
      </Row>
    </Content>
  );
}

export default DataPageView;