# Quick Start

### Install

::: code-group

```shell [pnpm]
pnpm install @smooth-data-loader/runtime-react
```

```shell [yarn]
yarn add @smooth-data-loader/runtime-react
```

```shell [npm]
npm install @smooth-data-loader/runtime-react
```

:::

### Usage

:::warning
React Router must use a version that supports [loader](https://reactrouter.com/en/main/route/loader#loader)
:::

#### Step1

Use React Router to declare a route.

```tsx
import { createRoot } from 'react-dom/client';
import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

const staticRoutes: RouteObject[] = [
  {
    path: '/',
    // ...
    children: [
      { // [!code focus]
        path: 'render', // [!code focus]
        lazy: () => import('./render/index'), // [!code focus]
      }, // [!code focus]
    ]
  }
];

const router = createBrowserRouter(staticRoutes);
const root = createRoot(document.getElementById('root')!);
root.render(<RouterProvider router={router}></RouterProvider>);
```

:::tip
For more information on React Router lazy configuration, see [React Router](https://reactrouter.com/en/main/route/lazy#lazy)
:::

#### Step2

Within your routing component, declare and export the defineLoader:

```tsx{1,12-20}
import { defineLoader, useLoaderData } from '@smooth-data-loader/runtime-react';
import { Await, AwaitProps, useAsyncValue } from 'react-router-dom';
import { Suspense } from 'react';

// this is your fetcher
const fetcher = () => {
  return defer({
    data: get('/api/render') as Promise<Data>,
  });
};

const { loader, swrData } = defineLoader(() => {
  // key
  return '/api/render';
}, fetcher);

export {
  loader,
  swrData,
};

function AwaitPart() {
  // use loader data
  const data = useAsyncValue() as Record<string, any>;

  return (
    <p>
      {`data is ${data.state || ''}`}
    </p>
  );
}

const Page = () => {
  const data = useLoaderData<typeof fetcher>();

  return (
    <>
      <div>part of page</div>
      <Suspense fallback={<p>Loading...</p>}>
        <Await
          resolve={data.data}
          errorElement={
            <p>Error loading async value</p>
        }
        >
          <AwaitPart />
        </Await>
      </Suspense>
    </>
  );
};

export default Page;

export {
  Page as Component,
};
```

:::tip
For more information on React Router deferred Data, see [React Router](https://reactrouter.com/en/main/guides/deferred)
:::

#### Step3

Change your original React Router Link to `SmoothLink`.


```tsx
import { Link } from 'react-router-dom'; // [!code --]
import { SmoothLink } from '@smooth-data-loader/runtime-react'; // [!code ++]

const Component = () => {
  return (
    <>
      <Link to="/nested/1"> render </Link> // [!code --]
      <SmoothLink to="/nested/1" prefetch="render"> render </SmoothLink> // [!code ++]
    </>
  );
};
export default Component;
```