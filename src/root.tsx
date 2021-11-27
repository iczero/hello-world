import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Head } from './util';
import { HelloPage } from './hello';
import { YayPage } from './yay';

export default () => <>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </Head>
  <HashRouter>
    <Routes>
      <Route path="/" element={<HelloPage />} />
      <Route path="/test" element={<YayPage />} />
    </Routes>
  </HashRouter>
  <style jsx global>{`
    body {
      font-family: sans-serif;
    }
  `}</style>
</>;
