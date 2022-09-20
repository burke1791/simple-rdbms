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

  const { highlightRecordIndex, stickyHighlightRecordIndex } = useDbState();

  const dbDispatch = useDbDispatch();

  useEffect(() => {
    if (highlightRecordIndex == props.recordIndex) {
      setClassName('data-highlight');
    } else if (stickyHighlightRecordIndex == props.recordIndex) {
      setClassName('sticky-highlight');
    } else {
      setClassName(null);
    }
  }, [stickyHighlightRecordIndex, highlightRecordIndex]);

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