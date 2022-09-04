import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import { PageData } from '../../components/pageData';

const { Content } = Layout;

function DataPagePanel() {

  /*
    
  */

  return (
    <Content>
      <Divider orientation='left'>Page Header</Divider>
      <Row justify='center'>
        {/* Data Page Header Info */}
      </Row>
      <Divider orientation='left'>Page Data</Divider>
      <Row justify='center'>
        <Col span={24}>
          <PageData />
        </Col>
      </Row>
    </Content>
  );
}

export default DataPagePanel;