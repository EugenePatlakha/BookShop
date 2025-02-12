import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import BookStore from './components/BookStore';

function App() {
  return (
    <BrowserRouter>
      <BookStore />
    </BrowserRouter>
  );
}

export default App;