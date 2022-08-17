import React, { useState } from 'react';
import { Button } from 'antd';

function TableItems(props) {

  const [tables, setTables] = useState([]);

  const handleTableResults = (data) => {
    console.log(data);
  }

  return (
    <Button
      type='primary'
      onClick={fetchTableList}
    >
      Fetch Tables
    </Button>
  );
}

export default TableItems;