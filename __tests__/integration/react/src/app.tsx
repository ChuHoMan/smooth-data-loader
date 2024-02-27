import { createRoot } from 'react-dom/client';
import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { SmoothLink } from '@smooth-data-loader/runtime-react';

const root = createRoot(document.getElementById('root')!);

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
          <SmoothLink to="/"> root </SmoothLink>
          <SmoothLink to="/render" prefetch="render"> render </SmoothLink>
          <SmoothLink to="/none" prefetch="none"> none </SmoothLink>
          <SmoothLink to="/nested/1" prefetch="render"> nested-1 </SmoothLink>
        </div>
        <SmoothLink to="/intent" prefetch="viewport"> intent </SmoothLink>
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
        path: 'nested',
        element: <Outlet />,
        children: [
          {
            path: ':id',
            lazy: () => import('./nested/index'),
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(staticRoutes);

root.render(<RouterProvider router={router}></RouterProvider>);
