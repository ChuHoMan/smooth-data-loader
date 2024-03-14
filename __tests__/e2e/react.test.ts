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

  // viewport
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportPromise = page.waitForResponse('**/api/viewport', {
    timeout: 10000,
  });
  await page.mouse.wheel(0, pageHeight);
  const viewportApiRes = await viewportPromise;
  expect(viewportApiRes.ok).toBeTruthy();
  expect(await viewportApiRes.json()).toMatchObject({
    state: 'viewport',
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

test('only preload component', async ({ page }) => {
  await page.goto('./', {
    waitUntil: 'networkidle',
  });

  await page.getByRole('link', { name: 'no-key' }).click();

  expect(page.getByText('no-key')).toBeVisible();
});
