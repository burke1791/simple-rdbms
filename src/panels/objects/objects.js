import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Menu } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { useDbConnectionState, useEditorDispatch, useEditorState } from '../../context';
import { NOTIF, Pubsub, QUERY_TYPE } from '../../utilities';

function ObjectsPanel(props) {

  const queryId = useRef(null);
  const [tables, setTables] = useState([]);
  const [tableMenuItems, setTableMenuItems] = useState([]);

  const { connected } = useDbConnectionState();
  const { internalObjectFlag } = useEditorState();
  const editorDispatch = useEditorDispatch();

  useEffect(() => {
    if (connected) {
      Pubsub.subscribe(NOTIF.QUERY_RESULT, ObjectsPanel, handleQueryResult);
      fetchTables();
    }
  }, [connected]);

  useEffect(() => {
    generateTableList();
  }, [internalObjectFlag, JSON.stringify(tables)]);

  const fetchTables = () => {
    const sql = 'Select object_id, schema_name, object_name, is_system_object From sys.objects Where object_type_id = 1';
    const uuid = window.crypto.randomUUID();

    queryId.current = uuid;

    const query = {
      sql: sql,
      type: QUERY_TYPE.BACKGROUND,
      id: uuid
    };

    Pubsub.publish(NOTIF.QUERY, query);
  }

  const handleQueryResult = (data) => {
    // console.log(data);
    if (data.queryId == queryId.current && data.type == 'RESULTS') {
      const sortedTables = data.recordset.sort((a, b) => a.schema_name - b.schema_name || a.object_name - b.object_name);
      setTables(sortedTables);
    } else {
      // console.log(data);
    }
  }

  const generateTableList = () => {
    const tableItems = tables.map(t => {
      const schema = t.columns.find(col => col.name == 'schema_name').value;
      const table = t.columns.find(col => col.name == 'object_name').value;
      const isSystemObject = t.columns.find(col => col.name == 'is_system_object').value;

      if (!internalObjectFlag && isSystemObject) {
        return null;
      } else {
        return (
          <Menu.Item key={`${schema}.${table}`}>
            {schema}.{table}
          </Menu.Item>
        );
      }
    });

    setTableMenuItems(tableItems);
  }

  const tableClicked = (event) => {
    const sql = `Select\t*\r\nFrom ${event.key}`;

    editorDispatch({ type: 'update', key: 'sql', value: sql });
  }

  return (
    <Menu
      mode='inline'
      style={{ width: '100%', height: 'calc(100vh - 50px)' }}
      theme='dark'
      defaultOpenKeys={['tables']}
      onClick={tableClicked}
      selectedKeys={[]}
    >
      <Menu.SubMenu
        key='tables'
        title={
          <Fragment>
            <TableOutlined /> Tables
          </Fragment>
        }
      >
        {tableMenuItems}
      </Menu.SubMenu>
    </Menu>
  );
}

export default ObjectsPanel;