import React, { useEffect, useState } from 'react';
import { Keccak, KeccakRand } from './keccak';
import { Buffer } from 'buffer';
import { onReady } from './ready';

export let keccak = new Keccak(12);
export let keccakRand = new KeccakRand(keccak, 1024);

let newEntropyListeners: Set<() => void> = new Set();
export function addEntropyListener(fn: () => void) {
  newEntropyListeners.add(fn);
}
export function removeEntropyListener(fn: () => void) {
  newEntropyListeners.delete(fn);
}
keccakRand.onNewEntropy = () => {
  for (let fn of newEntropyListeners) fn();
};

export async function throwHellomouse(get = true, send = true) {
  if (get) {
    let r1 = await fetch('https://hellomouse.net/api/random?length=64');
    let buf = Buffer.from(await r1.arrayBuffer());
    keccakRand.seedDirect(buf);
  }
  if (send) {
    await fetch('https://hellomouse.net/api/random', {
      method: 'POST',
      body: keccakRand.bytes(64)
    });
  }
}

export function reseed() {
  let buf = Buffer.alloc(256);
  window.crypto.getRandomValues(buf);
  keccakRand.seedDirect(buf);
  console.log('keccak reseeded');
}

reseed();
// completely necessary yes
Math.random = keccakRand.float.bind(keccakRand);

onReady(() => {
  throwHellomouse().then(() => {
    console.log('entropy received from hellomouse');
  }).catch(err => {
    console.log('failed to ask hellomouse for entropy:', err);
  });

  window.addEventListener('mousemove', ev => {
    let buf = Buffer.alloc(6);
    buf.writeUInt16LE(performance.now() & 0xffff, 0);
    buf.writeUInt16LE(ev.x & 0xffff, 2);
    buf.writeUInt16LE(ev.y & 0xffff, 2);
    keccakRand.write(buf);
  });

  window.addEventListener('keydown', ev => {
    let buf = Buffer.alloc(6);
    buf.writeUInt16LE(performance.now() & 0xffff, 0);
    buf.write(ev.code);
    keccakRand.write(buf);
  });
});

export function getRandomString() {
  return keccakRand.bytes(64).toString('hex');
}

export function useSubscribeEntropy(fn: () => any) {
  useEffect(() => {
    addEntropyListener(fn);
    return () => removeEntropyListener(fn);
  }, []);
}

export function KeccakButton() {
  let [randVal, setRandVal] = useState(getRandomString);
  function refresh() {
    let val = getRandomString();
    setRandVal(val);
    return val;
  }
  function buttonClicked() {
    navigator.clipboard?.writeText(refresh());
  }
  useSubscribeEntropy(refresh);
  return <button onClick={buttonClicked}>
    <pre>{randVal}</pre>
    <style jsx>{`
      pre {
        margin: 0;
      }
    `}</style>
  </button>;
}

export function KeccakSubmitButton() {
  let [state, setState] = useState('init');
  async function submit() {
    if (state === 'sending') return;
    setState('sending');
    await throwHellomouse();
    setState('done');
  }
  return <button onClick={submit}>
    {'Throw entropy at Hellomouse' + (state !== 'init' ? ': ' + state : '')}
  </button>;
}
