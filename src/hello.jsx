import React from 'react';

export function exclamify(a) {
  return a + '!';
}

export default () => <>
  <div>{exclamify('Hello, world')}</div>
  <style jsx>{`
    div {
      color: red;
    }
  `}</style>
</>;
