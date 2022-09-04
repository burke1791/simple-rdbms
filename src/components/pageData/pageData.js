import React, { useEffect } from 'react';
import { useDbDispatch, useDbState } from '../../context';

function PageData(props) {

  const { pageData, pageDataTrigger } = useDbState();
  const dbDispatch = useDbDispatch();

  useEffect(() => {
    if (pageDataTrigger) {
      console.log(pageData);
    }
  }, [pageDataTrigger]);

  return (
    <div></div>
  );
}

export default PageData;