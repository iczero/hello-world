import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Head } from './util';
import { HelloPage } from './pages/index';
import { YayPage } from './pages/yay';
import { ARXDerp } from './pages/arx-derp';
import { KeccakPage } from './pages/keccak';
import { FakerPage } from './pages/fakerjs';

export default () => <>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </Head>
  <HashRouter>
    <Routes>
      <Route path="/" element={<HelloPage />} />
      <Route path="/yay" element={<YayPage />} />
      <Route path="/keccak" element={<KeccakPage />} />
      <Route path="/arx-derp" element={<ARXDerp />} />
      <Route path="/fakerjs" element={<FakerPage />} />
    </Routes>
  </HashRouter>
  <style jsx global>{`@use 'third-party/normalize.css'`}</style>
  <style jsx global>{`@use 'global.scss'`}</style>
</>;
