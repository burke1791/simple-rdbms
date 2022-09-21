import React, { Fragment } from 'react';
import { Divider, Row } from 'antd';
import { NullBitmapOffset, NullBitmapOffsetDetails } from './nullBitmapOffset';
import { FixedLengthColumns, FixedLengthColumnDetails } from './fixedLengthColumns';
import { NullBitmap, NullBitmapDetails } from './nullBitmap';

/**
 * @typedef RecordPopoverProps
 * @property {import('./pageDataRecord').RecordMarkers} markers
 * @property {Number} recordIndex
 * @property {String} data 
 */

/**
 * @component RecordPopover
 * @param {RecordPopoverProps} props
 */
function RecordPopover(props) {

  return (
    <Fragment>
      <Row>
        <NullBitmapOffset data={parseNullBitmapOffset(props.data)} />
        <FixedLengthColumns data={parseFixedLengthColumns(props.data, props.markers)} />
        <NullBitmap data={parseNullBitmap(props.data, props.markers)} />
        <VariableLengthOffsetArray data={parseVariableLengthOffsetArray(props.data, props.markers)} />
        <VariableLengthColumns data={parseVariableLengthColumns(props.data, props.markers)} />
      </Row>
      <Divider orientation='left'>Null Bitmap Offset</Divider>
      <NullBitmapOffsetDetails data={parseNullBitmapOffset(props.data)} />
      <Divider orientation='left'>Fixed Length Columns</Divider>
      <FixedLengthColumnDetails data={parseFixedLengthColumns(props.data, props.markers)} />
      <Divider orientation='left'>Null Bitmap</Divider>
      <NullBitmapDetails data={parseNullBitmap(props.data, props.markers)} />
    </Fragment>
  );
}




function VariableLengthOffsetArray(props) {

  return (
    <span className='record-structure-chunk'>{props.data}</span>
  );
}

function VariableLengthColumns(props) {

  return (
    <span className='record-structure-chunk'>{props.data}</span>
  );
}

/**
 * @function
 * @param {String} data 
 * @returns {String}
 */
function parseNullBitmapOffset(data) {
  return data.substring(0, 4);
}

/**
 * @function
 * @param {String} data 
 * @param {import('./pageDataRecord').RecordMarkers} markers 
 * @returns {String}
 */
function parseFixedLengthColumns(data, markers) {
  return data.substring(4, markers.nullBitmapStart - markers.begin);
}

/**
 * @function
 * @param {String} data 
 * @param {import('./pageDataRecord').RecordMarkers} markers 
 * @returns {String}
 */
function parseNullBitmap(data, markers) {
  return data.substring(markers.nullBitmapStart - markers.begin, markers.nullBitmapEnd - markers.begin);
}

/**
 * @function
 * @param {String} data 
 * @param {import('./pageDataRecord').RecordMarkers} markers 
 * @returns {String}
 */
function parseVariableLengthOffsetArray(data, markers) {
  return data.substring(markers.variableOffsetStart - markers.begin, markers.variableOffsetEnd - markers.begin);
}

function parseVariableLengthColumns(data, markers) {
  return data.substring(markers.variableOffsetEnd - markers.begin);
}

export default RecordPopover;