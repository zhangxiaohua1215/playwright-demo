import { test, expect } from '@playwright/test';
import { AntdForm } from '../components/antd-form';
import { AntdSelect } from '../components/widgets/antd-select';

test('Advanced Select Features Test', async ({ page }) => {
  await page.goto('/select');

  const form = await AntdForm.create(page);
  const select = form.field<AntdSelect>('Favorite Color');

  // 1. Test getOptions
  const options = await select.getOptions();
  console.log('Options:', options);
  expect(options).toEqual(['Red', 'Green', 'Blue', 'Yellow', 'Purple']);

  // 2. Test search and select
  await select.search('Pur'); // Search for "Purple"

  // Verify value is selected
  expect(await select.getValue()).toBe('Purple');

  // 2.1 Test filtering without selecting (inputSearch)
  // Verify that typing 'Bl' filters the options to just 'Blue'
  await select.inputSearch('Bl');
  const dropdown = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
  await expect(dropdown.locator('.ant-select-item-option')).toHaveCount(1);
  await expect(dropdown.locator('.ant-select-item-option')).toHaveText('Blue');
  // Close dropdown to reset state for next test
  await page.keyboard.press('Escape');

  // 3. Test clearSearch (and clearing value)
  await select.clearSearch(); // This implementation in antd-select.ts clears the INPUT

  // Note: antd-select.ts clearSearch implementation just clears the input text.
  // If we want to clear the SELECTION (x button), that's different.
  // The user asked for "clearSearch" to clear the search box, but often "allowClear" means clearing the value.
  // Let's verify what clearSearch implementation does.
  // It clicks trigger, finds input, and clears it.
  // This is useful if we typed something but didn't select.

  // Let's add a test for searching something that doesn't exist, then clearing search.
  await select.search('Xyz');
  // Expect no options? Or just input has value.

  await select.clearSearch();
  // Input should be empty.

  // 4. Test normal setValue
  await select.setValue('Green');
  expect(await select.getValue()).toBe('Green');
});
