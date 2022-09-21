import React, { Fragment } from 'react';
import './pageData.css';
import { Row, Typography } from 'antd';

const { Text } = Typography;

/**
 * @typedef FixedLengthColumnsProps
 * @property {String} data
 */

/**
 * @component
 * @param {FixedLengthColumnsProps} props 
 */
function FixedLengthColumns(props) {
  
  return (
    <span className='record-structure-chunk'>{props.data}</span>
  );
}

/**
 * @typedef FixedLengthColumnDetailsProps
 * @property {String} data
 */

/**
 * @component
 * @param {FixedLengthColumnDetailsProps} props 
 */
function FixedLengthColumnDetails(props) {

  return (
    <Fragment>
      <Row>
        <Text underline>Fixed Length Columns: </Text>
        <Text code>{props.data}</Text>
      </Row>
      <Row>
        <Text>These are columns whose size (i.e. number of bytes) does not change regardless of the value contained within</Text>
      </Row>
    </Fragment>
  );
}

export {
  FixedLengthColumns,
  FixedLengthColumnDetails
}