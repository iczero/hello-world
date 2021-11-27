import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello';

document.addEventListener('DOMContentLoaded', () => {
  let appEl = document.createElement('div');
  document.body.appendChild(appEl);

  ReactDOM.render(<Hello />, appEl);
});
