import { Suspense } from 'react';
import { Await, AwaitProps, useAsyncValue, useMatches } from 'react-router-dom';

function AwaitPart() {
  const data = useAsyncValue() as Record<string, any>;
  const matches = useMatches();
  const match = matches?.[matches?.length - 1] || 'not-match';

  return (
    <p>
      {`${match.pathname} page, data is ${data.state || ''}`}
    </p>
  );
}

export default function AsyncPart({
  resolve,
}: {
  resolve: AwaitProps['resolve']
}) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Await
        resolve={resolve}
        errorElement={
          <p>Error loading async value</p>
      }
      >
        <AwaitPart />
      </Await>
    </Suspense>
  );
}
