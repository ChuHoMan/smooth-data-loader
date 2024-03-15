import { createRoot } from 'react-dom/client';
import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { SmoothLink } from '@smooth-data-loader/runtime-react';

const root = createRoot(document.getElementById('root')!);

async function onPrefetch() {
  await import('./custom-prefetch/index.json');
}

const staticRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      >
        <Outlet />
        <div style={{
          height: '180vh',
        }}
        >
          <div style={{
            height: '100vh',
          }}
          >
            <SmoothLink to="/"> root </SmoothLink>
            <SmoothLink to="/render" prefetch="render"> render </SmoothLink>
            <SmoothLink to="/none" prefetch="none"> none </SmoothLink>
            <SmoothLink to="/nested/1" prefetch="render"> nested-1 </SmoothLink>
            <SmoothLink to="/intent" prefetch="intent"> intent </SmoothLink>
            <SmoothLink to="/no-key" prefetch="intent"> no-key </SmoothLink>
            <SmoothLink
              to="/custom-prefetch"
              prefetch="intent"
              prefetchOptions={{
                onPrefetch,
              }}
            >
              custom-prefetch
            </SmoothLink>
          </div>
          <SmoothLink to="/viewport" prefetch="viewport"> viewport </SmoothLink>
        </div>
      </div>
    ),
    children: [
      {
        path: 'intent',
        lazy: () => import('./intent/index'),
        id: 'intent',
      },
      {
        path: 'render',
        lazy: () => import('./render/index'),
      },
      {
        path: 'none',
        lazy: () => import('./none/index'),
      },
      {
        path: 'viewport',
        lazy: () => import('./viewport/index'),
      },
      {
        path: 'nested',
        element: <Outlet />,
        children: [
          {
            path: ':id',
            lazy: () => import('./nested/index'),
          },
        ],
      },
      {
        path: 'no-key',
        lazy: () => import('./no-key/index'),
      },
      {
        path: 'custom-prefetch',
        lazy: () => import('./custom-prefetch/index'),
      },
    ],
  },
];

const router = createBrowserRouter(staticRoutes);

root.render(<RouterProvider router={router}></RouterProvider>);
