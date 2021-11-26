import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello';

let htmlEl = document.documentElement;
let bodyEl = document.createElement('body');
let appEl = document.createElement('div');
htmlEl.appendChild(bodyEl);
bodyEl.appendChild(appEl);

ReactDOM.render(<Hello />, appEl);
