import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Head } from './util';
import { HelloPage } from './hello';
import { YayPage } from './yay';
import { ARXDerp } from './arx-derp';
import { KeccakPage } from './keccak-page';

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
  <style jsx global>{`@use 'third-party/normalize.css'`}</style>
  <style jsx global>{`@use 'global.scss'`}</style>
</>;
