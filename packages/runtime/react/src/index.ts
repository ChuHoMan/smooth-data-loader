import { useLoaderData } from 'react-router';
import useSWR from 'swr';
import Link from './Link';

export {
  useSWR,
};

export {
  useLoaderData,
  Link as MisxLink,
};

export {
  defineLoader,
  useLoaderSWR,
} from './utils';

export { preload } from 'swr';

// export function createResourceLoader({
//     prefetchChunks,
//     timeoutFn = requestIdleCallback,
//     params,
//     timeout
// }: any) {
//     const observer = new IntersectionObserver(entries => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             observer.unobserve(entry = entry.target);
//             // Do not prefetch if will match/exceed limit
//             // if (toPrefetch.size < limit) {
//             //   toAdd(() => {
//                 // prefetchChunks ?
//                   prefetchChunks(entry, params)
//                 //   :
//                 //   prefetchHandler(entry.href);
//             //   });
//             // }
//           }
//         });
//       });

//       timeoutFn(() => {
//         // Find all links & Connect them to IO if allowed
//         document.querySelectorAll('a').forEach(link => {
//           // If the anchor matches a permitted origin
//           // ~> A `[]` or `true` means everything is allowed
//         //   if (!allowed.length || allowed.includes(link.hostname)) {
//             // If there are any filters, the link must not match any of them
//             // if (!isIgnored(link, ignores))
//              observer.observe(link);
//         //   }
//         });
//       }, {
//         timeout: timeout || 2000,
//       });
// }
