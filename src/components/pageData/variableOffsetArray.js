import React, { Fragment, useState } from 'react';
import './pageData.css';
import { Row, Typography } from 'antd';

const { Text } = Typography;

/**
 * @typedef VariableLengthOffsetArrayProps
 * @property {String} data
 */

/**
 * @component
 * @param {VariableLengthOffsetArrayProps} props 
 */
function VariableLengthOffsetArray(props) {

  return (
    <span className='record-structure-chunk'>{props.data}</span>
  );
}

/**
 * @typedef VariableLengthOffsetArrayDetailsProps
 * @property {String} data
 */

/**
 * @component
 * @param {VariableLengthOffsetArrayDetailsProps} props 
 */
function VariableLengthOffsetArrayDetails(props) {

  const generateVariableLengthOffsetArrayDisplay = () => {
    const numCols = props.data.substring(0, 2);

    const colPointers = props.data.substring(2).match(/[\s\S]{1,4}/g);
    
    return `${numCols}-${colPointers.join('|')}`;
  }

  const generateVarOffsetHelperText = () => {
    if (props.data.length >= 6) {
      const pointer = props.data.substring(2, 6);
      const pointerNum = Number(pointer);

      const text = `For example, the first pointer in this record (${pointer}) points ahead ${pointerNum} characters from the end of the variable offset array.`;

      return <Text>{text}</Text>;
    }

    return null;
  }

  return (
    <Fragment>
      <Row>
        <Text underline>Variable Length Offset Array: </Text>
        <Text code>{generateVariableLengthOffsetArrayDisplay()}</Text>
      </Row>
      <Row>
        <Text>The first two characters store the number of Non-Null variable length columns present in the record. The remaining characters are four-char offset pointers that point to the end of each variable length column from the end of the variable offset array to the end of the first column's data.</Text>
      </Row>
      <Row>
        {generateVarOffsetHelperText()}
      </Row>
    </Fragment>
  );
}

export {
  VariableLengthOffsetArray,
  VariableLengthOffsetArrayDetails
}