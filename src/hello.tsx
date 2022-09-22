import React, { MutableRefObject, useEffect, useRef } from 'react';
import { KeccakButton, KeccakSubmitButton } from './keccak-container';
import { Link } from 'react-router-dom';
import { Head } from './util';

export function exclamify(a: string): string {
  return a + '!';
}

export function HelloWorld() {
  let rainbowEl: MutableRefObject<HTMLSpanElement | null> = useRef(null);
  let colorEl: MutableRefObject<HTMLSpanElement | null> = useRef(null);
  let showColorState: MutableRefObject<{
    run: boolean;
    computed: null | CSSStyleDeclaration;
  }> = useRef({
    run: true,
    computed: null
  });

  useEffect(() => {
    function updateColor() {
      let el = rainbowEl.current;
      if (!el || !showColorState.current.run) return;
      if (!showColorState.current.computed) {
        showColorState.current.computed = window.getComputedStyle(el);
      }
      if (colorEl.current) {
        colorEl.current.textContent = showColorState.current.computed['color'];
      }
      requestAnimationFrame(updateColor);
    }
    updateColor();
    return () => void (showColorState.current.run = false);
  });

  return <>
    <div>
      <span className="hello" ref={rainbowEl}>
        {exclamify('Hello, world')}
      </span>
      &nbsp;
      <span className="color-info" ref={colorEl} />
    </div>
    <style jsx>{`
      .hello {
        font-size: 2em;
        animation: rainbow 10s linear infinite;
      }

      .color-info {
        font-family: monospace;
        vertical-align: top;
      }

      @keyframes rainbow {
        0% { color: red; }
        14.28% { color: orange; }
        28.57% { color: yellow; }
        42.86% { color: lime; }
        57.14% { color: blue; }
        71.43% { color: indigo; }
        85.71% { color: violet; }
        100% { color: red; }
      }
    `}</style>
  </>;
}

export function HelloPage() {
  return <div>
    <Head>
      <title>Hello, world!</title>
    </Head>
    <HelloWorld />
    <p>
      Welcome to iczero's homepage. There's a few things here.
    </p>
    <p>
      This is a Single-File Application. Not only is it single-page, it is also
      a self-contained HTML file containing nothing except one script tag. It is
      powered by React.
    </p>
    <p>
      Click for cryptographically secure random values (copied to clipboard):
      <br />
      <KeccakButton />
      <br />
      <KeccakSubmitButton />
    </p>
    <div>
      <p>Links to other pages:</p>
      <ul>
        <li><Link to="/test">Test page</Link></li>
        <li><Link to="/arx-derp">Bad random numbers</Link></li>
      </ul>
    </div>
  </div>;
}
