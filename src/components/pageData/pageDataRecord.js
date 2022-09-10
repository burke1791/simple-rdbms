import React, { useEffect, useState } from 'react';
import { useDbDispatch, useDbState } from '../../context';

/**
 * @typedef PageDataRecordProps
 * @property {String} data
 * @property {Number} recordIndex
 */

/**
 * @component
 * @param {PageDataRecordProps} props 
 */
function PageDataRecord(props) {

  const [className, setClassName] = useState(null);

  const { highlightRecordIndex } = useDbState();

  const dbDispatch = useDbDispatch();

  useEffect(() => {
    if (highlightRecordIndex == props.recordIndex) {
      setClassName('data-highlight');
    } else {
      setClassName(null);
    }
  }, [highlightRecordIndex]);

  const onMouseEnter = () => {
    dbDispatch({ type: 'update', key: 'highlightRecordIndex', value: props.recordIndex });
  }

  return (
    <span
      onMouseEnter={onMouseEnter}
      className={className}
    >
      {props.data}
    </span>
  )
}

export default PageDataRecord;