import React, { useEffect, useState, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';

import { NOTIF, Pubsub, QUERY_TYPE } from '../../utilities';
import { useDbDispatch } from '../../context';
import { useEditorDispatch, useEditorState } from '../../context/editorContext';
import { message } from 'antd';

function CodeEditor() {

  const queryId = useRef(null);
  const [sendQueryTrigger, setSendQueryTrigger] = useState(null);

  const { sql } = useEditorState();

  const editorDispatch = useEditorDispatch();
  const dbDispatch = useDbDispatch();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.QUERY_F5, CodeEditor, triggerQuery);
    Pubsub.subscribe(NOTIF.QUERY_RESULT, CodeEditor, handleQueryResult);

    return (() => {
      Pubsub.unsubscribe(NOTIF.QUERY_F5, CodeEditor);
      Pubsub.unsubscribe(NOTIF.QUERY_RESULT, CodeEditor);
    })
  }, []);

  useEffect(() => {
    if (sendQueryTrigger != null) {
      sendQuery();
    }
  }, [sendQueryTrigger]);

  const triggerQuery = () => {
    setSendQueryTrigger(new Date().valueOf());
  }

  const handleChange = (code) => {
    editorDispatch({ type: 'update', key: 'sql', value: code });
  }

  const sendQuery = () => {
    const uuid = window.crypto.randomUUID();

    queryId.current = uuid;

    const query = {
      sql: sql,
      type: QUERY_TYPE.USER,
      id: uuid
    };

    Pubsub.publish(NOTIF.QUERY, query);
  }

  const handleQueryResult = (data) => {
    if (data.queryId == queryId.current && data.type == 'RESULTS') {
      console.log(data.recordset);

      if (data.recordset && data.recordset.length == 0) {
        message.info('No records returned');
      }

      dbDispatch({ type: 'update', key: 'data', value: data.recordset });
      dbDispatch({ type: 'update', key: 'columnDefinitions', value: data.columnDefinitions });
      dbDispatch({ type: 'update', key: 'error', value: false });
      dbDispatch({ type: 'update', key: 'newData', value: new Date().valueOf() });
    } else if (data.queryId == queryId.current && data.type == 'ERROR') {
      console.log(data.error);
      dbDispatch({ type: 'update', key: 'data', value: null });
      dbDispatch({ type: 'update', key: 'columnDefinitions', value: null });
      dbDispatch({ type: 'update', key: 'error', value: true });
      dbDispatch({ type: 'update', key: 'newData', value: new Date().valueOf() });
    }
  }

  return (
    <Editor
      value={sql || ''}
      onValueChange={handleChange}
      highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
      padding={10}
      style={{ height: '50vh', width: '100%', fontFamily: 'monospace', border: '1px solid black' }}
    />
  );
}

export default CodeEditor;