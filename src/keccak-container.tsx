import React, { useEffect, useState } from 'react';
import { Keccak, KeccakRand } from './keccak';
import { Buffer } from 'buffer';
import { onReady } from './ready';

export let keccak = new Keccak(12);
export let keccakRand = new KeccakRand(keccak, 1024);
// allow usage from browser console
// @ts-expect-error
globalThis.keccakRand = keccakRand;

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

  let nextMouseEvent = 0;
  window.addEventListener('mousemove', ev => {
    let ts = performance.now();
    // ratelimit mouse events
    if (ts < nextMouseEvent) return;
    let buf = Buffer.alloc(6);
    buf.writeUInt16LE(ts & 0xffff, 0);
    buf.writeUInt16LE(ev.x & 0xffff, 2);
    buf.writeUInt16LE(ev.y & 0xffff, 4);
    keccakRand.write(buf);
    nextMouseEvent = ts + keccakRand.int(5, 35);
  });
  window.addEventListener('touchmove', ev => {
    let ts = performance.now();
    if (ts < nextMouseEvent) return;
    let buf = Buffer.alloc(2 + 4 * ev.touches.length);
    buf.writeUInt16LE(ts & 0xffff, 0);
    let off = 2;
    for (let i = 0; i < ev.touches.length; i++) {
      let t = ev.touches[i];
      buf.writeUInt16LE(t.screenX & 0xffff, off);
      off += 2;
      buf.writeUInt16LE(t.screenY & 0xffff, off);
      off += 2;
    }
    keccakRand.write(buf);
    nextMouseEvent = ts + keccakRand.int(5, 35);
  });

  window.addEventListener('keydown', ev => {
    let buf = Buffer.alloc(6);
    buf.writeUInt16LE(performance.now() & 0xffff, 0);
    buf.write(ev.code);
    keccakRand.write(buf);
  });
});

export function getRandomString(length = 16) {
  return keccakRand.bytes(length).toString('hex');
}

export function useSubscribeEntropy(fn: () => any) {
  useEffect(() => {
    addEntropyListener(fn);
    return () => removeEntropyListener(fn);
  }, []);
}

export function KeccakButton(props: { length?: number }) {
  let [randVal, setRandVal] = useState('');
  function refresh() {
    let val = getRandomString(props.length);
    setRandVal(val);
    return val;
  }
  useEffect(() => void refresh(), [props.length]);
  function buttonClicked() {
    let out = refresh();
    navigator.clipboard?.writeText(out);
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
    {'Send/receive entropy to Hellomouse' + (state !== 'init' ? ': ' + state : '')}
  </button>;
}
