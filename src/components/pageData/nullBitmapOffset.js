import React, { Fragment } from 'react';
import './pageData.css';
import { Row, Typography } from 'antd';

const { Text } = Typography;

/**
 * @typedef NullBitmapOffsetProps
 * @property {String} data
 */

/**
 * @component
 * @param {NullBitmapOffsetProps} props 
 */
function NullBitmapOffset(props) {

  return (
    <span className='record-structure-chunk'>{props.data}</span>
  )
}

/**
 * @typedef NullBitmapOffsetDetailsProps
 * @property {String} data
 */

/**
 * @component
 * @param {NullBitmapOffsetDetailsProps} props 
 */
 function NullBitmapOffsetDetails(props) {

  const getNumeralSuffix = () => {
    const remainder100 = Number(props.data) % 100;

    switch (remainder100) {
      case 11:
        return 'th';
      case 12:
        return 'th';
      case 13:
        return 'th'
    }

    const remainder10 = Number(props.data) % 10;

    switch (remainder10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd'
      default:
        return 'th';
    }
  }

  return (
    <Fragment>
      <Row>
        <Text underline>Null Bitmap Offset: </Text>
        <Text code>{props.data}</Text>
      </Row>
      <Row>
        <Text>Points forward in the record to the beginning of the Null Bitmap. In this case, the Null Bitmap begins at the {Number(props.data)}{getNumeralSuffix()} index.</Text>
      </Row>
    </Fragment>
  );
}

export {
  NullBitmapOffset,
  NullBitmapOffsetDetails
}