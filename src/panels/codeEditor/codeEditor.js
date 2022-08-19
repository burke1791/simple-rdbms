import React, { useEffect, useState, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';

import { NOTIF, Pubsub, QUERY_TYPE } from '../../utilities';
import { useDbDispatch } from '../../context';

function CodeEditor() {

  const queryId = useRef(null);
  const [sql, setSql] = useState('');
  const [sendQueryTrigger, setSendQueryTrigger] = useState(null);

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
    setSql(code);
  }

  const sendQuery = () => {
    const uuid = crypto.randomUUID();

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
      dbDispatch({ type: 'update', key: 'data', value: data.recordset });
      dbDispatch({ type: 'update', key: 'newData', value: new Date().valueOf() });
    } else if (data.queryId == queryId.current && data.type == 'ERROR') {
      console.log(error);
    }
  }

  return (
    <Editor
      value={sql}
      onValueChange={handleChange}
      highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
      padding={10}
      style={{ height: '50vh', width: '100%', fontFamily: 'monospace', border: '1px solid black' }}
    />
  );
}

export default CodeEditor;