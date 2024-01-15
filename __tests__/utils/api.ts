export function get(url: string) {
  return fetch(url, {
    method: 'get',
  }).then(res => res.json());
}
