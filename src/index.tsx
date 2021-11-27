import React from 'react';
import ReactDOM from 'react-dom';
import Root from './root';

document.addEventListener('DOMContentLoaded', () => {
  let appEl = document.createElement('div');
  document.body.appendChild(appEl);

  ReactDOM.render(<Root />, appEl);
});
