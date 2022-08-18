import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Menu } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { useDbState } from '../../context';
import { NOTIF, Pubsub } from '../../utilities';

function ObjectsPanel(props) {

  const queryId = useRef(null);
  const [tables, setTables] = useState([]);

  const { connected } = useDbState();

  useEffect(() => {
    if (connected) {
      Pubsub.subscribe(NOTIF.QUERY_RESULT_BACKGROUND, ObjectsPanel, handleQueryResult);
      fetchTables();
    }
  }, [connected]);

  const fetchTables = () => {
    const sql = 'Select object_id, schema_name, object_name From sys.objects Where object_type_id = 1';
    const uuid = crypto.randomUUID();

    queryId.current = uuid;

    const query = {
      sql: sql,
      id: uuid
    };

    Pubsub.publish(NOTIF.QUERY_BACKGROUND, query);
  }

  const handleQueryResult = (data) => {
    if (data.queryId == queryId.current) {
      const sortedTables = data.recordset.sort((a, b) => a.schema_name - b.schema_name || a.object_name - b.object_name);
      setTables(sortedTables);
    }
  }

  const generateTableList = () => {
    return tables.map(t => {
      const objectId = t.find(col => col.name == 'object_id').value;
      const schema = t.find(col => col.name == 'schema_name').value;
      const table = t.find(col => col.name == 'object_name').value;

      return (
        <Menu.Item key={objectId}>
          {schema}.{table}
        </Menu.Item>
      );
    });
  }

  return (
    <Menu
      mode='inline'
      style={{ width: '100%' }}
      theme='dark'
      defaultOpenKeys={['tables']}
    >
      <Menu.SubMenu
        key='tables'
        title={
          <Fragment>
            <TableOutlined /> Tables
          </Fragment>
        }
      >
        {generateTableList()}
      </Menu.SubMenu>
    </Menu>
  );
}

export default ObjectsPanel;