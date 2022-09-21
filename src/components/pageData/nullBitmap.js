import React, { Fragment } from 'react';
import './pageData.css';
import { Row, Typography } from 'antd';

const { Text } = Typography;

/**
 * @typedef NullBitmapProps
 * @property {String} data
 */

/**
 * @component
 * @param {NullBitmapProps} props 
 */
 function NullBitmap(props) {
  
  return (
    <span className='record-structure-chunk'>{props.data}</span>
  );
}

/**
 * @typedef NullBitmapDetailsProps
 * @property {String} data
 */

/**
 * @component
 * @param {NullBitmapDetailsProps} props 
 */
function NullBitmapDetails(props) {

  return (
    <Fragment>
      <Row>
        <Text underline>Null Bitmap: </Text>
        <Text code>{props.data}</Text>
      </Row>
      <Row>
        <Text>The first two characters store the number of columns in the record. The remaining characters identify if the column is NULL or not.</Text>
      </Row>
      <Row>
        <Text>The Null Bitmap is a storage optimization. With it, the engine does not need to store an explicit bit sequence that translates to NULL. It can simply omit the column from the record, which can save a lot of disk space if many columns are NULL.</Text>
      </Row>
    </Fragment>
  )
}

export {
  NullBitmap,
  NullBitmapDetails
}