import React, { useState } from 'react';
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
  return <button onClick={() => setRandVal(getRandomString())}>
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

export function HelloPage() {
  return <div>
    <Head>
      <title>Hello, world!</title>
    </Head>
    <div className="hello">{exclamify('Hello, world')}</div>
    <KeccakButton />
    <div><Link to="/test">Test page</Link></div>
    <div><Link to="/arx-derp">Bad random numbers</Link></div>
    <style jsx>{`
      .hello {
        font-size: 2em;
        animation: rainbow 10s linear infinite;
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
  </div>;
}
