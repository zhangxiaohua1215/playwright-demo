import { Locator } from '@playwright/test';
import { FormWidget } from './interface';

export class AntdSelect implements FormWidget<string> {
  constructor(private root: Locator) { }

  private get page() {
    return this.root.page();
  }

  async setValue(value: string) {
    // 1. 点击触发器 (Trigger)
    // 尝试点击 .ant-select-selector，如果不存在则点击 .ant-select
    const trigger = this.root.locator('.ant-select-selector').or(this.root.locator('.ant-select'));
    await trigger.first().click();

    // 2. 在 Body 中寻找下拉菜单 (Dropdown)
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');

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

  /**
   * 获取所有可用选项
   */
  async getOptions(): Promise<string[]> {
    const trigger = this.root.locator('.ant-select-selector').or(this.root.locator('.ant-select'));
    await trigger.first().click();

    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    await dropdown.waitFor();

    const options = await dropdown.locator('.ant-select-item-option-content').allInnerTexts();

    // 获取完选项后按 ESC 收起下拉菜单，避免遮挡或改变选中值
    await this.page.keyboard.press('Escape');

    return options;
  }

  /**
   * 输入搜索文本（仅输入，不选择）
   * 用于验证搜索过滤结果
   */
  async inputSearch(text: string) {
    const trigger = this.root.locator('.ant-select-selector').or(this.root.locator('.ant-select'));
    await trigger.first().click();

    // Ant Design Select 的输入框通常在 selector 内部
    const input = this.root.locator('input');
    await input.fill(text);

    // 等待下拉菜单出现
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    await dropdown.waitFor();
  }

  /**
   * 搜索并选择第一个匹配项
   */
  async search(text: string) {
    await this.inputSearch(text);

    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');

    // 选中第一个匹配项
    // 注意：这里假设搜索会有结果。如果没有结果，AntD 会显示 Empty 状态，click() 会失败或点错
    const option = dropdown.locator('.ant-select-item-option').first();
    if (await option.count() > 0) {
      await option.click();
    } else {
      console.warn(`No options found for search: ${text}`);
      // Close dropdown
      const trigger = this.root.locator('.ant-select-selector').or(this.root.locator('.ant-select'));
      await trigger.first().click();
    }
  }

  /**
   * 清空搜索内容
   */
  async clearSearch() {
    // 确保下拉框是打开的
    const trigger = this.root.locator('.ant-select-selector').or(this.root.locator('.ant-select'));
    await trigger.first().click();

    const input = this.root.locator('input');
    await input.clear();
  }

  getLocator() { return this.root; }
}
