import React from 'react';
import { Button, Layout } from 'antd';
import 'antd/dist/antd.css';

const { Sider, Content } = Layout;

function App() {

  return (
    <Layout>
      <Sider>

      </Sider>
      <Layout>
        <Content>
          <TestButton />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App;

function TestButton() {

  const buttonClicked = () => {
    console.log('click');
  }

  return (
    <Button
      type='primary'
      onClick={buttonClicked}
    >
      Test
    </Button>
  )
}