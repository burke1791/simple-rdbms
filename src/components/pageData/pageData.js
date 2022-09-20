import React, { useEffect, useState } from 'react';
import { useDbState } from '../../context';
import { getRecordIndexMarkers } from '../../database/bufferPool/deserializer';
import './pageData.css';
import PageDataRecord from './pageDataRecord';

function PageData() {

  const [dataPageElements, setDataPageElements] = useState([]);

  const { columnDefinitions, pageData, data, pageDataTrigger, pageId, highlightRecordIndex, stickyHighlightRecordIndex } = useDbState();

  useEffect(() => {
    if (pageDataTrigger) {
      if (pageData != undefined) {
        generateDataPageCharElements();
      }
    }
  }, [pageDataTrigger]);

  // useEffect(() => {
  //   if (pageData != undefined) {
  //     generateDataPageCharElements();
  //   }
  // }, [highlightRecordIndex, stickyHighlightRecordIndex]);

  const generateDataPageCharElements = () => {
    const elements = [];

    const recordMarkers = data.map(r => {
      return getRecordIndexMarkers(r.__record_index, pageData, columnDefinitions);
    });
    recordMarkers.sort((a, b) => a.begin - b.begin);

    let prevMarker = null;

    for (let marker of recordMarkers) {
      if (prevMarker == null) {
        const before = pageData.substring(0, marker.begin);
        elements.push(<span key={0}>{before}</span>);
      } else {
        const before = pageData.substring(prevMarker.end, marker.begin);
        elements.push(<span key={prevMarker.end-1}>{before}</span>);
      }

      const record = pageData.substring(marker.begin, marker.end);
      elements.push(<PageDataRecord key={marker.begin} recordIndex={marker.begin} data={record} />);
      prevMarker = marker;
    }

    const final = pageData.substring(prevMarker.end);
    elements.push(<span key={prevMarker.end}>{final}</span>);

    setDataPageElements(elements);
  }

  return (
    <div className='char-data-container char-data'>
      {dataPageElements}
    </div>
  );
}

export default PageData;