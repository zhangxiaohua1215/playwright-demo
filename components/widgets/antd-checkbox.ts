import { Locator } from '@playwright/test';
import { FormWidget } from './interface';

export class AntdCheckbox implements FormWidget<boolean> {
  constructor(private root: Locator) {}

  async setValue(checked: boolean) {
    // AntD Checkbox 的 input 是隐藏的，建议操作外层的 wrapper label
    const wrapper = this.root.locator('.ant-checkbox-wrapper');
    if (checked) {
      await wrapper.check();
    } else {
      await wrapper.uncheck();
    }
  }

  async getValue() {
    return await this.root.locator('input[type="checkbox"]').isChecked();
  }

  getLocator() { return this.root; }
}
