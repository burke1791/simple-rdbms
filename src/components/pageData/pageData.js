import React, { useEffect } from 'react';
import { useDbDispatch, useDbState } from '../../context';
import './pageData.css';

function PageData(props) {

  const { pageData, pageDataTrigger } = useDbState();
  const dbDispatch = useDbDispatch();

  useEffect(() => {
    if (pageDataTrigger) {
      console.log(pageData);
    }
  }, [pageDataTrigger]);

  const generatePageData = () => {
    return (
      <span>{pageData}</span>
    );
  }

  return (
    <div className='char-data-container char-data'>
      {generatePageData()}
    </div>
  );
}

export default PageData;