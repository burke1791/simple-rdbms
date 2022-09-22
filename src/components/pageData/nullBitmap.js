import React, { Fragment, useState } from 'react';
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

  const [numColumns] = useState(props.data.substring(0, 2));
  const [columns] = useState(props.data.substring(2));

  return (
    <Fragment>
      <Row>
        <Text underline>Null Bitmap: </Text>
        <Text code>{numColumns}-{columns}</Text>
      </Row>
      <Row>
        <Text>The first two characters store the size of the Null Bitmap. The remaining characters identify if the column is NULL or not. This record has a Null Bitmap with {Number(numColumns)} characters.</Text>
      </Row>
      <Row>
        <Text>The Null Bitmap is a storage optimization. With it, the engine does not need to store an explicit bit sequence that translates to NULL. It can simply omit NULL columns from the record, which can save a lot of disk space if many columns are NULL.</Text>
      </Row>
    </Fragment>
  )
}

export {
  NullBitmap,
  NullBitmapDetails
}