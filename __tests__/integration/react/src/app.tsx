import { createRoot } from 'react-dom/client';
import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { MisxLink } from '@smooth-data-loader/runtime-react';

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
          <MisxLink to="/"> root </MisxLink>
          <MisxLink to="/render" prefetch="render"> render </MisxLink>
          <MisxLink to="/none" prefetch="none"> none </MisxLink>
        </div>
        <MisxLink to="/intent" prefetch="viewport"> intent </MisxLink>
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
    ],
  },
];

const router = createBrowserRouter(staticRoutes);

root.render(<RouterProvider router={router}></RouterProvider>);
