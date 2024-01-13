import { createRoot } from 'react-dom/client';
import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { MisxLink } from '@smooth-data-loader/runtime-react';

const root = createRoot(document.getElementById('root')!);

// const LazyUser = lazy(() => import('./user/page'))

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
        <div style={{
          height: '180vh',
        }}
        >
          <MisxLink to="/"> root </MisxLink>
        </div>
        <MisxLink to="/user" prefetch="viewport">user </MisxLink>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: 'user',
        lazy: () => import('./user/page'),
        id: 'user',
        // loader
      },
    ],
  },
];

const router = createBrowserRouter(staticRoutes);

root.render(<RouterProvider router={router}></RouterProvider>);
