import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Buffer } from 'buffer';
import { Link } from 'react-router-dom';
import { Keccak, KeccakRand } from './keccak';
import { Head } from './util';

export let keccak = new Keccak(12);
export let keccakRand = new KeccakRand(keccak, 512);

function keccakReseed() {
  let buf = Buffer.alloc(256);
  window.crypto.getRandomValues(buf);
  keccakRand.seedDirect(buf);
}

keccakReseed();
// completely necessary yes
Math.random = keccakRand.float.bind(keccakRand);

export function getRandomString() {
  return keccakRand.bytes(64).toString('hex');
}

export function KeccakButton() {
  let [randVal, setRandVal] = useState(getRandomString);
  function buttonClicked() {
    let val = getRandomString();
    setRandVal(val);
    navigator.clipboard?.writeText(val);
  }
  return <button onClick={buttonClicked}>
    <pre>{randVal}</pre>
    <style jsx>{`
      pre {
        margin: 0;
      }
    `}</style>
  </button>;
}

export function exclamify(a: string): string {
  return a + '!';
}

export function HelloWorld() {
  let rainbowEl: MutableRefObject<HTMLSpanElement | null> = useRef(null);
  let colorEl: MutableRefObject<HTMLSpanElement | null> = useRef(null);
  let shouldRun = useRef(true);

  useEffect(() => {
    function updateColor() {
      let el = rainbowEl.current;
      if (!el || !shouldRun.current) return;
      let computed = window.getComputedStyle(el);
      if (colorEl.current) {
        colorEl.current.innerText = computed['color'];
      }
      requestAnimationFrame(updateColor);
    }
    updateColor();
    return () => void (shouldRun.current = false);
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
        42.86% { color: green; }
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
