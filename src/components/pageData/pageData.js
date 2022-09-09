import React, { useEffect, useState } from 'react';
import { useDbState } from '../../context';
import './pageData.css';

function PageData(props) {

  const [dataPageElements, setDataPageElements] = useState([]);

  const { pageData, pageDataTrigger } = useDbState();

  useEffect(() => {
    if (pageDataTrigger) {
      generateDataPageCharElements();
    }
  }, [pageDataTrigger]);

  const generateDataPageCharElements = () => {
    const charElements = <span>{pageData}</span>;
    setDataPageElements(charElements);
  }

  return (
    <div className='char-data-container char-data'>
      {dataPageElements}
    </div>
  );
}

export default PageData;