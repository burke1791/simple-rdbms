import React, { useEffect } from 'react';
import { useDbDispatch } from '../context';
import { BufferPool } from '../database/bufferPool';
import { parser, startup } from '../database/server';
import { NOTIF, Pubsub } from '../utilities';

const buffer = new BufferPool(10);

function DbWrapper(props) {

  const dbDispatch = useDbDispatch();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.QUERY, DbWrapper, executeQuery);
    Pubsub.subscribe(NOTIF.QUERY_BACKGROUND, DbWrapper, executeQueryBackground);

    startDbServer();

    return (() => {
      dbDispatch({ type: 'update', key: 'connected', value: false });
      Pubsub.unsubscribe(NOTIF.QUERY, DbWrapper);
    });
  }, []);

  const startDbServer = () => {
    startup(buffer);
    dbDispatch({ type: 'update', key: 'connected', value: true });
  }

  const executeQuery = (query) => {
    console.log('received query: ');
    console.log(query);
    const tree = parser(query.sql);
    console.log(tree);
    const records = buffer.executeQuery(tree);
    const result = {
      queryId: query.id,
      recordset: records
    };
    Pubsub.publish(NOTIF.QUERY_RESULT, result);
  }

  const executeQueryBackground = (query) => {
    console.log('received query: ');
    console.log(query);
    const tree = parser(query.sql);
    console.log(tree);
    const records = buffer.executeQuery(tree);
    const result = {
      queryId: query.id,
      recordset: records
    };
    Pubsub.publish(NOTIF.QUERY_RESULT_BACKGROUND, result);
  }

  return props.children;
}

export default DbWrapper;