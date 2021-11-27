import React from 'react';
import ReactDOM from 'react-dom';

export function Head(props: { children: React.ReactNode }) {
  return ReactDOM.createPortal(props.children, document.head);
}
