import { Locator } from '@playwright/test';
import { FormWidget } from './interface';

import { AntdInput } from './antd-input';
import { AntdSelect } from './antd-select';
import { AntdCheckbox } from './antd-checkbox';
import { AntdDatePicker } from './antd-datepicker';

// 构造函数类型定义
export type WidgetConstructor = new (root: Locator) => FormWidget;

// 注册配置接口
export interface WidgetRegistration {
  widget: WidgetConstructor;
  selector?: string; // 如果不提供 selector，则作为默认/兜底组件，或者不参与自动扫描
}

// 统一配置表：Key 是组件类型名称，Value 是配置
// 使用 satisfies Record<string, WidgetRegistration> 确保值符合结构
// 使用 as const 确保 TS 推导出具体的字面量类型 (Key 和 Value) 而不是宽泛的 Record 类型
export const WIDGET_REGISTRY: Record<string, WidgetRegistration> = {
  // 1. 复杂/嵌套组件 (顺序很重要：越复杂的越靠前)
  'Select': { widget: AntdSelect, selector: '.ant-select' },
  'DatePicker': { widget: AntdDatePicker, selector: '.ant-picker' },
  'Checkbox': { widget: AntdCheckbox, selector: '.ant-checkbox-wrapper' },

  // 2. 基础组件
  'Input': { widget: AntdInput, selector: 'input.ant-input' },

  // 3. 兜底
  'Default': { widget: AntdInput } // 没有 selector，仅作为 fallback
} as const;

// --- 类型元编程魔法区域 ---

// 1. 自动提取 WidgetType 类型
export type WidgetType = keyof typeof WIDGET_REGISTRY;

// 2. 自动生成 DetectionRule 列表
// 过滤掉没有 selector 的配置，并保持 Object.entries 的顺序 (虽然 JS 对象顺序有一定规则，但最好显式处理)

export interface DetectionRule {
  type: WidgetType;
  selector: string;
}

export const ANT_DESIGN_RULES: DetectionRule[] = Object.entries(WIDGET_REGISTRY)
  .filter(([_, config]) => 'selector' in config && config.selector)
  .map(([type, config]) => ({
    type: type as WidgetType,
    selector: (config as any).selector
  }));

// 3. 自动生成 WidgetMap
export const WIDGET_MAP: Record<string, WidgetConstructor> = Object.fromEntries(
  Object.entries(WIDGET_REGISTRY).map(([type, config]) => [type, config.widget])
);
