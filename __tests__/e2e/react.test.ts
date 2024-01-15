import { expect, test } from '@playwright/test';

test('link preload', async ({ page }) => {
  const renderPromise = page.waitForResponse('**/api/render', {
    timeout: 10000,
  });

  await page.goto('./', {
    waitUntil: 'networkidle',
  });

  const renderApiRes = await renderPromise;
  expect(renderApiRes.ok).toBeTruthy();
  expect(await renderApiRes.json()).toMatchObject({
    state: 'render',
  });

  await page.getByRole('link', { name: 'intent' }).hover();
  const statePromise = page.waitForResponse('**/api/intent', {
    timeout: 10000,
  });

  const stateApiRes = await statePromise;
  expect(stateApiRes.ok).toBeTruthy();
  expect(await stateApiRes.json()).toMatchObject({
    state: 'intent',
  });
});

test('loader with suspense', async ({ page }) => {
  await page.goto('./none');
  expect(page.getByText('part of page')).toBeVisible();
  expect(page.getByText('Loading...')).toBeVisible();

  await page.waitForLoadState('networkidle');

  expect(page.getByText('/none page, data is none')).toBeVisible();
  expect(page.getByText('Loading...')).toBeHidden();
});
