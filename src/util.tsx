import React, { ChangeEvent, useState } from 'react';
import ReactDOM from 'react-dom';

export function Head(props: { children: React.ReactNode }) {
  return ReactDOM.createPortal(props.children, document.head);
}

export function normalizeIntegerInput(value: string, min: number | null, max: number | null): number {
  let n = +value;
  if (Number.isNaN(n)) return 0;
  if (min && n < min) n = min;
  if (max && n > max) n = max;
  return n;
}

export function useForceUpdate() {
  let [n, s] = useState(false);
  return () => s(!n);
}

export function NumberInput(props: {
  min?: number;
  max?: number;
  default?: number;
  integer?: boolean;
  onChange: (n: number) => void;
}) {
  let [text, setText] = useState(props.default?.toString() ?? '');
  let changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
    let value = ev.target.value;
    if (value === '') {
      setText('');
      return;
    }
    let n = +value;
    if (Number.isNaN(n)) return;
    if (typeof props.min !== 'undefined' && n < props.min) {
      n = props.min;
    } else if (typeof props.max !== 'undefined' && n > props.max) {
      n = props.max;
    }
    let precision = 0;
    if (props.integer) n = Math.round(n);
    else {
      let split = value.split('.');
      if (split[1]) precision = split[1].length;
    }
    setText(n.toFixed(precision));
    props.onChange(n);
  };
  return <input type="number" value={text} onChange={changeHandler} />;
}
