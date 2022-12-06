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
  }, []);

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
        12.5% { color: orange; }
        25% { color: yellow; }
        37.5% { color: lime; }
        50% { color: aqua; }
        62.5% { color: blue; }
        75% { color: indigo; }
        87.5% { color: darkviolet; }
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
        <li><Link to="/keccak">Good random numbers (keccak)</Link></li>
        <li><Link to="/arx-derp">Bad random numbers</Link></li>
      </ul>
    </div>
    <p>
      Source: <a href="https://github.com/iczero/hello-world">
        https://github.com/iczero/hello-world</a>
    </p>
  </div>;
}
