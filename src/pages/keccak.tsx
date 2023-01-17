import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeccakButton, keccakRand, KeccakSubmitButton } from '../keccak-container';
import { Head, NumberInput, useMemoWithInvalidate } from '../util';

export function KeccakPage() {
  return <div>
    <Head><title>KeccakRand™</title></Head>
    <div>
      <KeccakButton />
      <br />
      <KeccakSubmitButton />
    </div>
    <CoinFlipWidget />
    <RandIntWidget />
    <RandFloatWidget />
    <RandColorWidget />
    <RandNormWidget />
    <RandBytesWidget />
    <EntropySubmitWidget />
    <Link to="/">Go home</Link>
  </div>;
}

export function EntropySubmitWidget() {
  let [text, setText] = useState('');
  let submit = () => {
    keccakRand.write(Buffer.from(text));
    setText('');
  };
  return <div>
    <h2>Submit entropy</h2>
    <textarea rows={1} cols={32} placeholder="Type or paste something..."
      value={text} onChange={ev => setText(ev.target.value)}
      onKeyDown={ev => ev.key === 'Enter' && (ev.preventDefault(), submit())} />
    <button onClick={submit}>Submit</button>
  </div>;
}

export function RandIntWidget() {
  let [min, setMin] = useState(1);
  let [max, setMax] = useState(6);
  let [count, setCount] = useState(1);
  let [output, regenerate] = useMemoWithInvalidate(() => {
    let [nmin, nmax] = [min, max];
    if (nmax < nmin) [nmin, nmax] = [nmax, nmin];
    try {
      return keccakRand.intMany(count, nmin, nmax + 1).join(', ');
    } catch (err) {
      return 'Error: range is too large';
    }
  }, [min, max, count]);
  const MAX = Number.MAX_SAFE_INTEGER - 1;
  return <div>
    <h2>Random integer</h2>
    Min: <NumberInput integer={true} default={1} min={-MAX} max={MAX} onChange={setMin} /><br />
    Max: <NumberInput integer={true} default={6} min={-MAX} max={MAX} onChange={setMax} /><br />
    Count: <NumberInput integer={true} default={1} min={1} max={1024} onChange={setCount} /><br />
    Output: {output}<br />
    <button onClick={regenerate}>Regenerate</button>
  </div>;
}

export function CoinFlipWidget() {
  let [output, regenerate, times] = useMemoWithInvalidate(() => {
    return keccakRand.bool() ? 'Heads / Yes' : 'Tails / No';
  }, []);
  return <div>
    <h2>Flip a coin</h2>
    Output [{times}]: {output}<br />
    <button onClick={regenerate}>Regenerate</button>
  </div>;
}

export function RandNormWidget() {
  let [mean, setMean] = useState(5);
  let [deviation, setDeviation] = useState(1);
  let [count, setCount] = useState(1);
  let [output, regenerate] = useMemoWithInvalidate(
    () => keccakRand.normMany(count, mean, deviation).slice(0, count).join('\n'),
    [mean, deviation, count]
  );
  return <div>
    <h2>Random sample from normal distribution</h2>
    Mean: <NumberInput default={5} onChange={setMean} /><br />
    Deviation: <NumberInput default={1} onChange={setDeviation} /><br />
    Count: <NumberInput integer={true} default={1} min={1} max={1024} onChange={setCount} /><br />
    Output: <br />
    <span style={{ whiteSpace: 'pre' }}>{output}</span><br />
    <button onClick={regenerate}>Regenerate</button>
  </div>;
}

export function RandFloatWidget() {
  let [count, setCount] = useState(1);
  let [output, regenerate] = useMemoWithInvalidate(
    () => keccakRand.floatMany(count).join('\n').toString(), [count]);
  return <div>
    <h2>Random float (uniform distribution) from 0 to 1</h2>
    Count: <NumberInput integer={true} default={1} min={1} max={1024} onChange={setCount} /><br />
    Output: <br />
    <span style={{ whiteSpace: 'pre' }}>{output}</span><br />
    <button onClick={regenerate}>Regenerate</button>
  </div>;
}

export function RandBytesWidget() {
  let [encoding, setEncoding] = useState<BufferEncoding>('base64');
  let [length, setLength] = useState(64);
  let [output, regenerate] = useMemoWithInvalidate(
    () => keccakRand.bytes(length).toString(encoding), [encoding, length]);
  return <div>
    <h2>Random bytes</h2>
    Length: <NumberInput integer={true} default={64} min={1} max={65536} onChange={setLength} /><br />
    Encoding: <select onChange={ev => setEncoding(ev.target.value as BufferEncoding)}>
      <option value="base64">base64</option>
      <option value="hex">hex</option>
      <option value="utf-8">UTF-8 (warning: expect nonsense)</option>
    </select><br />
    Output: <br />
    <textarea style={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
      rows={3} cols={48} readOnly={true} value={output} /><br />
    <button onClick={regenerate}>Regenerate</button>
  </div>;
}

export function RandColorWidget() {
  let canvas = useRef<HTMLCanvasElement>(null);
  let [canvasError, setCanvasError] = useState('');
  let [color, regenerate] = useMemoWithInvalidate(
    () => '#' + keccakRand.bytes(3).toString('hex'), []);
  useEffect(() => {
    let cv = canvas.current!;
    let ctx = cv.getContext('2d');
    if (!ctx) {
      setCanvasError('canvas not working or unavailable');
      return;
    }
    ctx.fillStyle = color;
    ctx?.fillRect(0, 0, cv.width, cv.height);
  }, [color]);
  return <div>
    <h2>Random color</h2>
    {
      canvasError === ''
        ? <canvas width={64} height={64} ref={canvas} />
        : <div>{canvasError}</div>
    }
    <pre style={{ margin: 0 }}>{color}</pre>
    <button onClick={regenerate}>Regenerate</button>
  </div>;
}
