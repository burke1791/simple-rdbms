import React, { useEffect } from 'react';
import { useDbConnectionDispatch, useDbDispatch, useDbState } from '../context';
import { BufferPool } from '../database/bufferPool';
import { startup } from '../database/server';
import { clearLocalStorage, NOTIF, Pubsub } from '../utilities';
import sqliteParser from 'sqlite-parser';
import { executeQuery } from '../database/queryProcessor';

const buffer = new BufferPool(10);

function DbWrapper(props) {

  const dbDispatch = useDbDispatch();
  const dbConnectionDispatch = useDbConnectionDispatch();

  const { pageIdRequest, pageIdRequestTrigger } = useDbState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.QUERY, DbWrapper, processQuery);

    startDbServer();

    return (() => {
      dbConnectionDispatch({ type: 'update', key: 'connected', value: false });
      Pubsub.unsubscribe(NOTIF.QUERY, DbWrapper);
    });
  }, []);

  useEffect(() => {
    if (pageIdRequestTrigger && pageIdRequest) {
      getPageData();
    }
  }, [pageIdRequestTrigger]);

  const startDbServer = () => {
    // clearLocalStorage();
    startup(buffer);
    dbConnectionDispatch({ type: 'update', key: 'connected', value: true });
  }

  const getPageData = () => {
    const data = buffer.getPageData(pageIdRequest);
    dbDispatch({ type: 'update', key: 'pageData', value: data });
    dbDispatch({ type: 'update', key: 'pageDataTrigger', value: new Date().valueOf() });
  }

  const processQuery = (query) => {
    // console.log('received query: ');
    // console.log(query);

    try {
      const tree = sqliteParser(query.sql);
      // console.log(tree);

      let queryTree;

      if (tree.type == 'statement' && tree.variant == 'list') {
        if (tree.statement.length > 1) {
          throw new Error('Only one query at a time is currently supported');
        } else {
          queryTree = tree.statement[0];
        }
      }

      // console.log(queryTree);

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