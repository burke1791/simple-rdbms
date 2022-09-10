import React, { useEffect, useState } from 'react';
import { useDbState } from '../../context';
import { getRecordIndexMarkers } from '../../database/bufferPool/deserializer';
import './pageData.css';

function PageData() {

  const [dataPageElements, setDataPageElements] = useState([]);

  const { columnDefinitions, pageData, pageDataTrigger, highlightRecordIndex } = useDbState();

  useEffect(() => {
    if (pageDataTrigger) {
      console.log('page trigger');
      generateDataPageCharElements();
    }
  }, [pageDataTrigger]);

  useEffect(() => {
    const markers = getRecordIndexMarkers(highlightRecordIndex, pageData, columnDefinitions);
    generateDataPageCharElements(markers);
  }, [highlightRecordIndex]);

  const generateDataPageCharElements = (markers) => {
    let before = '';
    let record = '';
    let after = '';
    const charElements = [];
    if (markers != undefined) {
      for (let i in pageData) {
        if (i < markers.begin) {
          before += pageData[i];
        } else if (i >= markers.end) {
          after += pageData[i];
        } else {
          record += pageData[i];
        }
      }

      charElements.push(<span key='before'>{before}</span>);
      charElements.push(<span key='record' className='data-highlight'>{record}</span>);
      charElements.push(<span key='after'>{after}</span>);
    } else {
      charElements.push(<span key='data'>{pageData}</span>)
    }

    setDataPageElements(charElements);
  }

  return (
    <div className='char-data-container char-data'>
      {dataPageElements}
    </div>
  );
}

export default PageData;