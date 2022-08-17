import React, { useEffect, useState, useRef } from 'react';
import { Input } from 'antd';
import { NOTIF, Pubsub } from '../../utilities';

const { TextArea } = Input;

function CodeEditor() {

  const queryId = useRef(null);
  const [sql, setSql] = useState('');
  const [sendQueryTrigger, setSendQueryTrigger] = useState(null);

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

  const handleChange = (e) => {
    setSql(e.target.value);
  }

  const sendQuery = () => {
    const uuid = crypto.randomUUID();

    queryId.current = uuid;

    const query = {
      sql: sql,
      id: uuid
    };

    Pubsub.publish(NOTIF.QUERY, query);
  }

  const handleQueryResult = (data) => {
    if (data.queryId == queryId.current) {
      console.log(data.recordset);
    }
  }

  return (
    <TextArea
      value={sql}
      style={{ height: '50vh', width: '100%', fontFamily: 'monospace' }}
      onChange={handleChange}
    />
  );
}

export default CodeEditor;