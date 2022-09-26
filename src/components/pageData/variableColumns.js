import React, { Fragment, useState } from 'react';
import './pageData.css';
import { Row, Typography } from 'antd';

const { Text } = Typography;

/**
 * @typedef VariableLengthColumnsProps
 * @property {String} data
 */

/**
 * @component
 * @param {VariableLengthColumnsProps} props 
 */
function VariableLengthColumns(props) {

  return (
    <span className='record-structure-chunk'>{props.data}</span>
  );
}

/**
 * @typedef VariableLengthColumnDetailsProps
 * @property {String} data
 */

/**
 * @component
 * @param {VariableLengthColumnDetailsProps} props 
 */
function VariableLengthColumnDetails(props) {

  return (
    <Fragment>
      <Row>
        <Text underline>Variable Length Columns: </Text>
        <Text code>{props.data}</Text>
      </Row>
      <Row>
        <Text>Variable length columns are stored one right after another. Thanks to the variable offset array, the storage engine knows exactly where one column begins and ends.</Text>
      </Row>
    </Fragment>
  );
}

export {
  VariableLengthColumns,
  VariableLengthColumnDetails
}