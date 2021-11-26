import React, { useState } from 'react';
import { Buffer } from 'buffer';
import { Keccak, KeccakRand } from './keccak';

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
  <div className="hello">{exclamify('Hello, world')}</div>
  <KeccakButton />
  <style jsx>{`
    .hello {
      color: red;
    }
  `}</style>
</>;
