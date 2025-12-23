import { Page, Locator } from '@playwright/test';
import { FormWidget } from './widgets/interface';
import { ANT_DESIGN_RULES, WIDGET_MAP, WidgetType } from './widgets/registry';

export class AntdForm {
  readonly page: Page;
  readonly root: Locator;

  // 缓存：Label -> 组件类型
  private schema: Map<string, WidgetType> = new Map();

  constructor(page: Page, rootSelector = 'form.ant-form') {
    this.page = page;
    this.root = page.locator(rootSelector);
  }

  /**
   * 静态工厂方法，自动创建并扫描表单
   */
  static async create(page: Page, rootSelector = 'form.ant-form'): Promise<AntdForm> {
    const form = new AntdForm(page, rootSelector);
    await form.scanFields();
    return form;
  }

  /**
   * 核心引擎：在浏览器上下文中扫描表单结构
   */
  async scanFields() {
    await this.root.waitFor();

    // 1. 注入规则，并在浏览器内执行分析
    const detectedFields = await this.root.evaluate((formElement, rules) => {
      const results: { label: string; type: string }[] = [];
      const items = formElement.querySelectorAll('.ant-form-item');

      items.forEach(item => {
        const controlNode = item.querySelector('.ant-form-item-control');

        // --- 卫语句：防止处理幽灵节点 ---
        if (!controlNode) return;

        // --- 策略：多级 Label 解析 ---
        let label = '';
        // 1. 找标准 Label
        const labelNode = item.querySelector('.ant-form-item-label label');
        if (labelNode) {
          label = labelNode.textContent?.trim() || '';
        }
        // 2. 找控件内文本 (针对 Checkbox/Button)
        if (!label) {
          const text = (controlNode as HTMLElement).innerText?.trim();
          if (text && text.length < 30) label = text;
        }
        // 3. 找 Placeholder (针对无 Label 输入框)
        if (!label) {
          const input = controlNode.querySelector('input');
          if (input && input.placeholder) label = input.placeholder;
        }

        if (!label) return; // 实在找不到名字，跳过

        // --- 策略：基于 Selector 的类型推导 ---
        let detectedType = 'Default';

        for (const rule of rules) {
          // 直接在 control 内部查找子孙，命中即止
          if (controlNode.querySelector(rule.selector)) {
            detectedType = rule.type;
            break;
          }
        }

        results.push({ label, type: detectedType });
      });

      return results;
    }, ANT_DESIGN_RULES);

    // 2. 更新本地映射表
    this.schema.clear();
    for (const field of detectedFields) {
      this.schema.set(field.label, field.type as WidgetType);
    }

    // 调试用：打印扫描结果
    console.log('Form Schema Detected:', Object.fromEntries(this.schema));
  }

  /**
   * 获取指定 Label 对应的控件区域 Locator
   * 供高级用户手动实例化组件或进行原生 Playwright 操作
   */
  getLocator(labelText: string): Locator {
    return this.root
      .locator('.ant-form-item', { hasText: labelText }) // 这里的 hasText 很宽松，也能匹配到 placeholder
      .locator('.ant-form-item-control');
  }

  /**
   * 获取组件实例 (原 getField)
   */
  field<T extends FormWidget = FormWidget>(labelText: string): T {
    // 1. 查表
    const type = this.schema.get(labelText);
    if (!type) {
      throw new Error(`Field "${labelText}" not found in schema. Did you forget to call scanFields()?`);
    }

    // 2. 实例化
    const WidgetClass = WIDGET_MAP[type] || WIDGET_MAP['Default'];

    // 3. 使用 getLocator 方法定位
    return new WidgetClass(this.getLocator(labelText)) as T;
  }

  /**
   * 批量输入表单
   * @param data 键值对对象，key 为 Label，value 为要输入的值
   */
  async setValues(data: Record<string, any>) {
    for (const [label, value] of Object.entries(data)) {
      await this.field(label).setValue(value);
    }
  }

  /**
   * 获取按钮组件
   */
  button(name: string): Locator {
    return this.root.getByRole('button', { name });
  }
}
