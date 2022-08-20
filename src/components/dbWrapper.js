import React, { useEffect } from 'react';
import { useDbDispatch } from '../context';
import { BufferPool } from '../database/bufferPool';
import { startup } from '../database/server';
import { NOTIF, Pubsub } from '../utilities';
import sqliteParser from 'sqlite-parser';
import { executeQuery } from '../database/queryProcessor';

const buffer = new BufferPool(10);

function DbWrapper(props) {

  const dbDispatch = useDbDispatch();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.QUERY, DbWrapper, processQuery);

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

  const processQuery = (query) => {
    console.log('received query: ');
    console.log(query);

    try {
      const tree = sqliteParser(query.sql);
      console.log(tree);

      let queryTree;

      if (tree.type == 'statement' && tree.variant == 'list') {
        if (tree.statement.length > 1) {
          throw new Error('Only one query at a time is currently supported');
        } else {
          queryTree = tree.statement[0];
        }
      }

      console.log(queryTree);

      const records = executeQuery(buffer, queryTree);

      const result = {
        queryId: query.id,
        type: 'RESULTS',
        recordset: records
      };
      Pubsub.publish(NOTIF.QUERY_RESULT, result);
    } catch (error) {
      console.log(error);
      const result = {
        queryId: query.id,
        type: 'ERROR',
        error: error
      }
      Pubsub.publish(NOTIF.QUERY_RESULT, result);
    }
  }

  return props.children;
}

export default DbWrapper;