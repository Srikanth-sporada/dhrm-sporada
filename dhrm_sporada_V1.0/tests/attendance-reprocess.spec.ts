import {test} from '@playwright/test'

test('Attendance Reprocess', async ({page}) => {
  await page.goto('http://192.168.1.205:4200');
  await page.getByText('Trainee New Application').click();
  await page.getByText('Executive Login').click();
  await page.getByRole('textbox', { name: 'Enter Employee ID' }).click();
  await page.getByRole('textbox', { name: 'Enter Employee ID' }).fill('12345');
  await page.getByRole('textbox', { name: 'Enter Employee ID' }).press('Tab');
  await page.getByRole('textbox', { name: 'Enter Your Password' }).fill('123');
  await page.getByRole('button', { name: 'LogIn' }).click();
  await page.getByRole('button', { name: 'Time Office' }).click();
  await page.getByRole('link', { name: 'Attendance Reprocess' }).click();
  await page.getByText('Select Payroll Area').click();
  await page.getByRole('option', { name: '52' }).click();
  await page.locator('p-button button').click();
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByText('logout').click();
})