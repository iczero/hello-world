import React, { useEffect, useMemo } from 'react';
import {
  Link, useNavigate, RouterProvider, createHashRouter, Outlet, useLocation,
  useRouteError
} from 'react-router-dom';
import { Head } from './util';
import { HelloPage } from './pages/index';
import { YayPage } from './pages/yay';
import { ARXDerp } from './pages/arx-derp';
import { KeccakPage } from './pages/keccak';
import { FakerPage } from './pages/fakerjs';

export function UnknownRoute() {
  let navigate = useNavigate();
  return <div>
    <p>Unknown route!</p>
    <p>
      <button onClick={() => navigate(-1)}>Go back</button>{' '}
      or <Link to="/" replace>go home</Link>
    </p>
  </div>;
}

function RootErrorHandler() {
  let navigate = useNavigate();
  let location = useLocation();
  let error: any = useRouteError();

  console.log('error', error);
  console.log('location', location);

  // handle errors from urls such as page.html#path, redirect to page.html#/path
  if (error?.internal && error?.status === 404) {
    if (!location.pathname.startsWith('/')) {
      useEffect(() => navigate({
        pathname: '/' + location.pathname,
        search: location.search,
        hash: location.hash
      }, { replace: true }));
      return <div>Redirecting...</div>;
    }
  }

  console.error(`error rendering page ${location.pathname}:`, error);
  return <div>
    <pre>
      Error rendering page "{location.pathname}" (see console)<br />
      {error.toString()}
    </pre>
  </div>;
}

export function AppRoot() {
  return <Outlet />;
}

export default () => {
  // Before you ask "why is this in the component", please consider that this
  // app is built in an extremely cursed manner. Modules are loaded *before* the
  // page actually exists, as it is replaced in order get rid of quirks mode.
  // In this process, all event handlers, including history, are discarded.
  let router = useMemo(() => createHashRouter([
    {
      path: '/',
      element: <AppRoot />,
      errorElement: <RootErrorHandler />,
      children: [
        {
          index: true,
          element: <HelloPage />
        },
        {
          path: 'yay',
          element: <YayPage />
        },
        {
          path: 'keccak',
          element: <KeccakPage />
        },
        {
          path: 'arx-derp',
          element: <ARXDerp />
        },
        {
          path: 'fakerjs',
          element: <FakerPage />
        },
        {
          path: '*',
          element: <UnknownRoute />
        }
      ]
    }
  ]), []);

  return <React.StrictMode>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <RouterProvider router={router} />
    <style jsx global>{`@use 'third-party/normalize.css'`}</style>
    <style jsx global>{`@use 'global.scss'`}</style>
  </React.StrictMode>;
};
