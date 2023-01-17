import { _doReady } from './ready';
import ReactDOMClient from 'react-dom/client';
import createRoot from './root';

export function waitEvent(target: EventTarget, event: string) {
  return new Promise(resolve => {
    target.addEventListener(event, resolve, { once: true });
  });
}

let contentLoaded = waitEvent(document, 'DOMContentLoaded');

export async function initializePage() {
  // totally sane function, yes
  console.log('Hello, world!');

  // grab ourself
  let selfScript = document.currentScript;

  // wait for script to finish loading
  await contentLoaded;

  // get rid of quirks mode if currently in quirks mode
  if (document.compatMode !== 'CSS1Compat') {
    // replace document
    document.open();
    document.write('<!DOCTYPE html>'); // quirks mode be gone
    document.close();

    // attach ourself to new document (not actually needed, but fun)
    if (selfScript) document.head.appendChild(selfScript);

    // create body
    let body = document.createElement('body');
    document.body = body;
  }

  // create react root element
  let appEl = document.createElement('div');
  appEl.id = 'react-root';
  document.body.appendChild(appEl);

  // prepare to render root
  let didRenderRoot = false;
  let renderRoot = () => {
    if (didRenderRoot) return;
    didRenderRoot = true;
    // create react root and attach
    let root = ReactDOMClient.createRoot(appEl);
    root.render(createRoot());
  };
  // determine if we are in a zero-sized frame
  if (window.innerWidth !== 0 || window.innerHeight !== 0) {
    renderRoot();
  } else {
    let resizeListener = () => {
      if (window.innerWidth > 0 || window.innerHeight > 0) {
        window.removeEventListener('resize', resizeListener);
        console.log('window became visible, rendering root');
        renderRoot();
      }
    };
    // listen for resize events
    window.addEventListener('resize', resizeListener);
  }

  // fire ready handlers
  _doReady();
}

initializePage();
