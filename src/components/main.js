import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataPageView, IDE } from '../pages';

function Main() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IDE />} />
        <Route path='/data-page' element={<DataPageView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;