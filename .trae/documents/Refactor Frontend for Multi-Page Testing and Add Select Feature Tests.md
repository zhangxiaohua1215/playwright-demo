# Playwright Ant Design Automation Framework Implementation Plan

I will implement the framework and test application as requested, ensuring all modifications are applied.

## 1. Environment Setup & Test Application

Create a React + Ant Design application to serve as the "System Under Test".

* **Dependencies**: Install `react`, `react-dom`, `antd`, `vite`, `@vitejs/plugin-react`.

* **Structure**:

  * `src/App.tsx`: Contains a form with Input, Select, Checkbox, and Button components to match the test requirements.

  * `vite.config.ts`: Configuration for serving the app.

  * `playwright.config.ts`: Update `webServer` config to start the app before tests.

## 2. Framework Implementation (`components/`)

Implement the Page Object Model structure with the requested modifications.

### Directory Structure

```text
components/
├── widgets/
│   ├── interface.ts    # Interface definition (FormWidget)
│   ├── rules.ts        # Detection rules
│   ├── antd-input.ts   # Implementation
│   ├── antd-select.ts  # Implementation
│   ├── antd-checkbox.ts# Implementation
│   └── index.ts        # Factory/Map
└── antd-form.ts        # Main Form Class
```

### Key Modifications

1. **Interfaces**: `IFormWidget` -> `FormWidget`.
2. **Constructors**: `constructor(root: Locator)` only.

   * *Note*: `AntdSelect` will use `root.page()` to access the global page object for dropdowns.
3. **AntdForm Enhancements**:

   * `field(label: string)` (renamed from `getField`).

   * `button(name: string)`: Returns button locator.

   * `static async create(page: Page, rootSelector?: string)`: Factory method scanning the form immediately.

## 3. Test Implementation (`tests/`)

* **`tests/components.spec.ts`**: A comprehensive test suite.

  * Use `AntdForm.create()` to initialize.

  * Verify `field('Label').setValue()` and `getValue()`.

  * Verify `button('Submit')` interaction.

  * Verify auto-detection of widget types.

## 4. Documentation

* Update `设计方案.md` to reflect the final directory structure, API names, and usage examples.

## Execution Order

1. Install dependencies and setup React app.
2. Implement the Framework code (`components/`).
3. Write the Test Suite (`tests/`).
4. Run tests to verify implementation.
5. Update Documentation.

