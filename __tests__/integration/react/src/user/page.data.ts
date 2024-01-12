import { defineLoader } from '@smooth-data-loader/runtime-react';
import { defer } from 'react-router-dom';

const { loader, swrData } =  defineLoader((params) => {
  console.log('params', params)

  return '/api/state'
}, ({ params }) => {
  console.log('loader')

  return defer({
    data: fetch('/api/state', {
      credentials: 'include'
    }).then(res => res.json()).then(res => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(res)
        }, 3000)
      })
    })
    // data: new Promise(resolve => {
    //   setTimeout(async () => {
    //     const userJSON = (await import('./user.json')).default
    //     resolve(userJSON)
    //   }, 1000)
    // })
  })
});

export {
  loader,
  swrData
}