import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Head } from '../util';

export function YayPage() {
  let [shouldError, setShouldError] = useState(false);
  if (shouldError) {
    throw new Error('oh no!');
  }

  return <div>
    <Head>
      <title>yay!</title>
    </Head>
    <p className="yay">Yay!</p>
    <Link to="/">Go home</Link><br />
    <button onClick={() => setShouldError(true)}>oh no!</button>
    <style jsx>{`
      .yay {
        font-size: 3em;
        padding-left: 1em;
      }
    `}</style>
  </div>;
}
