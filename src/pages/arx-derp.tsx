import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { keccakRand } from '../keccak-container';
import { Head, sleep } from '../util';

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
    // rotate entire state right by 19
    sv.setUint32(0, u32RotateRight(sv.getUint32(0, le), 19), le);
  }

  next(): number {
    this.round();
    return this.getState();
  }
}

function seedFromKeccak(): number {
  let buf = keccakRand.bytes(4);
  return buf.readUInt32LE();
}

class RandomBitWrapper {
  bitPos = 0;
  current: number;

  constructor(public rng: BadRandom) {
    this.current = rng.next();
  }

  next(): boolean {
    if (this.bitPos >= 32) {
      this.current = this.rng.next();
      this.bitPos = 0;
    }

    return Boolean(this.current & (1 << this.bitPos++));
  }
}

const CANVAS_DEFAULT_WIDTH = 32;
const CANVAS_DEFAULT_HEIGHT = 512;

export function ARXDerp() {
  let rng: React.MutableRefObject<BadRandom | null> = useRef(null);
  let canvas: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  let [canvasWidth, setCanvasWidth] = useState(CANVAS_DEFAULT_WIDTH);
  let [canvasHeight, setCanvasHeight] = useState(CANVAS_DEFAULT_HEIGHT);
  let [rngCurrent, setRngCurrent] = useState<number | string>(0);
  let [onesFreq, setOnesFreq] = useState(0);
  let [calculatedPeriod, setCalculatedPeriod] = useState('0');
  let [manualSeed, setManualSeed] = useState('');
  useLayoutEffect(() => {
    rng.current = new BadRandom(seedFromKeccak());
    setRngCurrent(rng.current.getState());
  }, []);

  function refreshCanvas() {
    let width = canvas.current!.width;
    let height = canvas.current!.height;
    let ctx = canvas.current!.getContext('2d');
    if (!ctx) {
      // ah yes the pinnacle of error reporting
      setRngCurrent('canvas error :(');
      return;
    }
    // skip rendering if zero-sized canvas
    if (!width || !height) return;
    let imageData = ctx.createImageData(width, height);
    let imageBuf = imageData.data;

    let bitWrapper = new RandomBitWrapper(rng.current!);
    let onesCount = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // ImageData uses RGBA
        let pos = (width * y + x) * 4;
        let value = Number(bitWrapper.next()) * 255;
        if (value) onesCount++;
        imageBuf[pos + 0] = value; // red
        imageBuf[pos + 1] = value; // green
        imageBuf[pos + 2] = value; // blue
        imageBuf[pos + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setOnesFreq(onesCount / (width * height));
  }

  useEffect(() => refreshCanvas(), [canvasWidth, canvasHeight]);

  async function calculatePeriod() {
    const INTERVAL = 1000 / 15;
    const BATCH = 1024;
    let gen = rng.current!;
    let period = 0;
    let seen = new Uint8Array(2 ** 32 / 8);
    let rate = 0;
    function update(period: number, rate: number) {
      setCalculatedPeriod(`${period}, ${rate.toFixed(0)} it/s`);
    }
    outer: while (true) {
      let start = performance.now();
      let startIndex = period;
      while (performance.now() - start < INTERVAL) {
        for (let i = 0; i < BATCH; i++) {
          let val = gen.next();
          let idx = val >>> 3;
          let bit = val & 7;
          if (seen[idx] & (1 << bit)) break outer;
          seen[idx] |= 1 << bit;
          period++;
        }
      }
      rate = (period - startIndex) / (performance.now() - start) * 1000;
      update(period, rate);
      await sleep();
    }
    update(period, rate);
  }

  function reseed() {
    rng.current!.seed(seedFromKeccak());
    setRngCurrent(rng.current!.getState());
  }

  return <div>
    <Head><title>ARX permutation test</title></Head>
    <div>
      <button onClick={() => setRngCurrent(rng.current!.next())}>
        <pre>{rngCurrent}</pre>
        <style jsx>{`
          pre {
            margin: 0;
          }
        `}</style>
      </button>
      <button onClick={() => refreshCanvas()}>Refresh canvas</button>
      <br />
      <button onClick={() => calculatePeriod()}>Calculate period: <code>{calculatedPeriod}</code></button>
      <button onClick={() => reseed()}>Reseed</button>
    </div>
    <div>
      Manual seed: <input type="number" value={manualSeed} onChange={ev => {
        setManualSeed(ev.target.value);
        let seed = +ev.target.value;
        if (!Number.isNaN(seed)) rng.current!.seed(seed);
      }} />
      <br />
      Canvas width: <input type="number" value={canvasWidth || ''}
        onChange={ev => setCanvasWidth(+ev.target.value || 0)} />
      <br />
      Canvas height: <input type="number" value={canvasHeight || ''}
        onChange={ev => setCanvasHeight(+ev.target.value || 0)} />
      <br />
      Frequency of ones: {onesFreq}
    </div>
    <canvas ref={canvas} width={canvasWidth} height={canvasHeight} />
  </div>;
}
