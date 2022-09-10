import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import { PageData } from '../../components/pageData';

const { Content } = Layout;

function DataPagePanel() {

  return (
    <Content>
      <Row justify='center'>
        <Col span={24}>
          <PageData />
        </Col>
      </Row>
    </Content>
  );
}

export default DataPagePanel;