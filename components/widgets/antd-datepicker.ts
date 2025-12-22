import { Locator } from '@playwright/test';
import { FormWidget } from './interface';

export class AntdDatePicker implements FormWidget<string> {
  constructor(private root: Locator) {}

  async setValue(value: string) {
    const input = this.root.locator('input');
    await input.click(); // Focus first
    await input.fill(value);
    await input.press('Enter'); // Confirm date and close popup
  }

  async getValue() {
    return await this.root.locator('input').inputValue();
  }

  getLocator() { return this.root; }
}
