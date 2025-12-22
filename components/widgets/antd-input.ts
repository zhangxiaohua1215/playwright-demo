import { Locator } from '@playwright/test';
import { FormWidget } from './interface';

export class AntdInput implements FormWidget<string> {
  constructor(private root: Locator) {}

  async setValue(value: string) {
    // 查找 control 区域内的 input 标签
    await this.root.locator('input').fill(value);
  }

  async getValue() {
    return await this.root.locator('input').inputValue();
  }

  getLocator() { return this.root; }
}
