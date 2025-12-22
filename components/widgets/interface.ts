import { Locator } from '@playwright/test';

export interface FormWidget<T = any> {
  /** 核心方法：设置组件的值 */
  setValue(value: T): Promise<void>;
  
  /** 核心方法：获取组件的值（用于断言） */
  getValue(): Promise<T>;
  
  /** 暴露底层 Locator 以便进行特殊操作（如 hover, dblclick） */
  getLocator(): Locator;
}
