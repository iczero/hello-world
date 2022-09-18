import React, { useState, useRef, useLayoutEffect } from 'react';

function u8RotateLeft(a: number, n: number): number {
  a &= 0xff; // ensure value in range
  if (n < 0 || n > 7) throw new Error('bad rotate');
  return ((a << n) & 0xff) | (a >>> (8 - n) & 0xff);
}

function u32RotateRight(a: number, n: number): number {
  a >>>= 0; // type guard
  if (n < 0 || n > 31) throw new Error('bad rotate');
  return (((a << (32 - n)) >>> 0) | ((a >>> n) >>> 0)) >>> 0;
}

class BadRandom {
  state: ArrayBuffer;
  stateView: DataView;
  littleEndian = true;

  constructor(seedValue = Math.floor(Math.PI * 1e9)) {
    this.state = new ArrayBuffer(4);
    this.stateView = new DataView(this.state);
    this.seed(seedValue);
  }

  seed(value: number) {
    this.stateView.setUint32(0, value, this.littleEndian);
  }

  getState() {
    return this.stateView.getUint32(0, this.littleEndian);
  }

  round() {
    let sv = this.stateView;
    let le = this.littleEndian;
    // add first u16 to second u16, store result in first u16
    sv.setUint16(0, (sv.getUint16(0, le) + sv.getUint16(2, le)) & 0xffff, le);
    // rotate each byte in state left by 2, 3, 4, 5 bits, respectively
    sv.setUint8(0, u8RotateLeft(sv.getUint8(0), 2));
    sv.setUint8(1, u8RotateLeft(sv.getUint8(1), 3));
    sv.setUint8(2, u8RotateLeft(sv.getUint8(2), 4));
    sv.setUint8(3, u8RotateLeft(sv.getUint8(3), 5));
    // xor bytes 0 and 3, store in 3; xor bytes 1 and 2, store in 1
    sv.setUint8(3, sv.getUint8(0) ^ sv.getUint8(3));
    sv.setUint8(1, sv.getUint8(1) ^ sv.getUint8(2));
    // rotate entire state right by 3
    sv.setUint32(0, u32RotateRight(sv.getUint32(0, le), 3), le);
  }

  next(): number {
    this.round();
    return this.getState();
  }
}

function seedFromCryptoAPI(): number {
  let v = new Uint32Array(1);
  window.crypto.getRandomValues(v);
  return v[0];
}

export function ARXDerp() {
  let rng: React.MutableRefObject<BadRandom | null> = useRef(null);
  let [rngCurrent, setRngCurrent] = useState(0);
  useLayoutEffect(() => {
    rng.current = new BadRandom(seedFromCryptoAPI());
    setRngCurrent(rng.current.getState());
  }, []);
  return <div>
    <button onClick={() => setRngCurrent(rng.current!.next())}>
      <pre>{rngCurrent}</pre>
      <style jsx>{`
        pre {
          margin: 0;
        }
      `}</style>
    </button>
  </div>;
}
