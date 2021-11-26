import React from 'react';
import ReactDOM from 'react-dom';
import Derp from './derp.jsx';

let htmlEl = document.documentElement;
let bodyEl = document.createElement('body');
htmlEl.appendChild(bodyEl);
ReactDOM.render(<Derp />, bodyEl);
