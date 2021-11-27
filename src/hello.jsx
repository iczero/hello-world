import React, { useState } from 'react';
import { Buffer } from 'buffer';
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

export function exclamify(a) {
  return a + '!';
}

export default () => <>
  <Head>
    <title>Hello, world!</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </Head>
  <>
    <div className="hello">{exclamify('Hello, world')}</div>
    <KeccakButton />
    <style jsx>{`
      .hello {
        font-size: 2em;
        font-family: sans-serif;
        animation: rainbow 10s infinite;
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
  </>
</>;
