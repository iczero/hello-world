import React from 'react';
import ReactDOMClient from 'react-dom/client';
import Root from './root';

export function waitEvent(target: EventTarget, event: string) {
  return new Promise(resolve => {
    target.addEventListener(event, resolve, { once: true });
  });
}

export async function initializePage() {
  // totally sane function, yes
  console.log('Hello, world!');

  // wait for script to finish loading
  await waitEvent(document, 'DOMContentLoaded');

  // grab ourself
  let selfScript = document.getElementsByTagName('script')[0];

  // replace document
  document.open();
  document.write('<!DOCTYPE html>'); // quirks mode be gone
  document.close();

  // attach ourself to new document (not actually needed, but fun)
  document.head.appendChild(selfScript);

  // create body
  let body = document.createElement('body');
  document.body = body;
  // create react root element
  let appEl = document.createElement('div');
  appEl.id = 'react-root';
  document.body.appendChild(appEl);

  // create react root and attach
  let root = ReactDOMClient.createRoot(appEl);
  root.render(<Root />);
}

initializePage();
