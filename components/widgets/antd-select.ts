import { Locator } from '@playwright/test';
import { FormWidget } from './interface';

export class AntdSelect implements FormWidget<string> {
  constructor(private root: Locator) { }

  async setValue(value: string) {
    // 1. 点击触发器 (Trigger)
    // 尝试点击 .ant-select-selector，如果不存在则点击 .ant-select
    const trigger = this.root.locator('.ant-select-selector').or(this.root.locator('.ant-select'));
    await trigger.first().click();

    // 2. 在 Body 中寻找下拉菜单 (Dropdown)
    const page = this.root.page();
    const dropdown = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');

    // 3. 选中对应的 Option
    // 使用 exact: true 避免 "Male" 匹配到 "Female"
    // 允许前后空格
    const option = dropdown.locator('.ant-select-item-option').filter({ hasText: new RegExp(`^\\s*${value}\\s*$`) });

    // Debug info if not found
    if (await option.count() === 0) {
      console.log(`Warning: Option "${value}" not found. Available:`, await dropdown.locator('.ant-select-item-option').allInnerTexts());
    }

    await option.first().click();
  }

  async getValue() {
    // 获取选中的文本
    // 尝试多种可能的类名 (AntD 版本差异)
    const item = this.root.locator('.ant-select-selection-item').or(this.root.locator('.ant-select-content-value'));
    return await item.innerText();
  }

  getLocator() { return this.root; }
}
