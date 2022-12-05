import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Head } from './util';
import { HelloPage } from './hello';
import { YayPage } from './yay';
import { ARXDerp } from './arx-derp';
import { KeccakPage } from './keccak-page';
// TODO: css loader or something in webpack for automatic minification
import normalizeCss from './assets/normalize.css.txt';

export default () => <>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </Head>
  <HashRouter>
    <Routes>
      <Route path="/" element={<HelloPage />} />
      <Route path="/test" element={<YayPage />} />
      <Route path="/keccak" element={<KeccakPage />} />
      <Route path="/arx-derp" element={<ARXDerp />} />
    </Routes>
  </HashRouter>
  <style jsx global>{normalizeCss}</style>
  <style jsx global>{`
    body {
      font-family: sans-serif;
      margin: 0.5rem;
      line-height: 1.5;
    }
  `}</style>
</>;
