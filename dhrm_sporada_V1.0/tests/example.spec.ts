import { test, expect } from '@playwright/test';

test('executive login', async ({page}) => {
  await page.goto('http://192.168.1.205:4200');
  const dropDown =  page.locator('#pr_id_2_label');
   await dropDown.click();
  const executiveLogin =  page.getByRole('option', { name: 'Executive Login' });
  await executiveLogin.click();
  const username = page.locator('#username');
  await username.fill('12345');
  const password = page.locator('#password');

  await password.fill('123');
  await page.getByRole('button', { name: 'LogIn' }).click();

  await page.waitForURL('**/rhrm');
  await page.pause();

  await page.screenshot({path:'ss.png'});

  await page.close();
})