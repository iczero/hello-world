import React from 'react';
import { Link } from 'react-router-dom';
import { Head } from './util';

export function YayPage() {
  return <div>
    <Head>
      <title>yay!</title>
    </Head>
    <p className="yay">Yay!</p>
    <Link to="/">Go home</Link>
    <style jsx>{`
      .yay {
        font-size: 3em;
      }
    `}</style>
  </div>;
}
