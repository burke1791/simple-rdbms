import { Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDbDispatch, useDbState } from '../../context';
import RecordPopover from './RecordPopover';

/**
 * @typedef RecordMarkers
 * @property {Number} begin
 * @property {Number} end
 * @property {Number} nullBitmapStart
 * @property {Number} nullBitmapEnd
 * @property {Number} variableOffsetStart
 * @property {Number} variableOffsetEnd
 */

/**
 * @typedef PageDataRecordProps
 * @property {String} data
 * @property {Number} recordIndex
 * @property {RecordMarkers} markers
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
    <Popover
      title='Record Details' 
      content={
        <RecordPopover
          markers={props.markers}
          recordIndex={props.recordIndex}
          data={props.data}
        />
      }
    >
      <span
        onMouseEnter={onMouseEnter}
        className={className}
      >
        {props.data}
      </span>
    </Popover>
  )
}

export default PageDataRecord;