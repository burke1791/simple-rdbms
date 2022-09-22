import React, { Fragment } from 'react';
import { Col, Row, Switch, Typography } from 'antd';
import { useEditorDispatch, useEditorState } from '../context';

const { Text } = Typography;

function InternalObjectToggle(props) {

  const { internalObjectFlag } = useEditorState()
  const editorDispatch = useEditorDispatch()

  const switchToggled = (checked) => {
    editorDispatch({ type: 'update', key: 'internalObjectFlag', value: checked });
  }

  return (
    <div style={{ minHeight: 50, backgroundColor: '#fff' }}>
      <Row justify='center'>
        <Text>Show Internal Objects</Text>
      </Row>
      <Row justify='center'>
        <Switch
          checked={!!internalObjectFlag}
          onChange={switchToggled}
        />
      </Row>
    </div>
  );
}

export default InternalObjectToggle;