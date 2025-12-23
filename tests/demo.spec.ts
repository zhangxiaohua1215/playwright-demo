import { test, expect } from '@playwright/test';
import { AntdForm } from '../components/antd-form';

test('Ant Design Form Automation Demo (Basic)', async ({ page }) => {
  await page.goto('/basic');

  // 1. Initialize and scan the form
  const form = await AntdForm.create(page);

  // 2. Interact with widgets
  await form.setValues({
    'Username': 'testuser',
    'Gender': 'Male',
    'Agreement': true,
    'Birth Date': '2023-01-01'
  });

  // 3. Verify values
  expect(await form.field('Username').getValue()).toBe('testuser');
  expect(await form.field('Gender').getValue()).toBe('Male');
  expect(await form.field('Agreement').getValue()).toBe(true);
  expect(await form.field('Birth Date').getValue()).toBe('2023-01-01');

  // 4. Submit
  await form.button('Submit').click();
});
