# ChatGPT 会话导航插件开发计划

- 文档版本：v1.0
- 文档状态：草案
- 对应 PRD：[chatgpt_message_navigation_prd_v1.md](/Users/liang/Desktop/program/md/chatgpt-pins/docs/chatgpt_message_navigation_prd_v1.md)
- 文档日期：2026-03-19
- 适用范围：MVP / 第一版开发落地

---

## 1. 文档目标

本文档用于指导 ChatGPT 会话导航插件的实际开发工作，补充以下内容：

1. 项目推荐技术栈
2. 代码目录结构与模块边界
3. MVP 功能拆解与开发顺序
4. 测试策略、测试步骤与验收方法
5. 构建发布与后续扩展建议

---

## 2. 开发目标

本项目第一阶段聚焦于构建一个可稳定运行的浏览器扩展 MVP，满足以下目标：

1. 在 ChatGPT 长会话中识别用户消息并生成导航索引
2. 在页面右侧渲染低干扰导航栏
3. 支持悬停预览、点击跳转、目标高亮
4. 支持滚动同步当前激活项
5. 支持动态新增消息与会话切换后的自动重建
6. 保证长会话下基础性能和可维护性

---

## 3. 推荐技术栈

## 3.1 核心栈

建议采用以下技术方案：

- `TypeScript`：统一类型约束，降低 DOM 识别和状态同步过程中的维护成本
- `Vite`：用于本地开发、热更新和生产构建，启动快，配置简单
- `@crxjs/vite-plugin`：用于生成 Manifest V3 浏览器扩展构建产物
- `Manifest V3`：浏览器扩展标准，满足 Chrome / Edge 发布要求
- `原生 DOM + Shadow DOM`：内容脚本 UI 采用轻量原生实现，避免引入前端框架体积和样式冲突
- `CSS Variables`：管理深浅主题、激活态、高亮态和 tooltip 样式

## 3.2 工程与质量工具

- `pnpm`：推荐包管理器，安装快，锁文件稳定
- `ESLint`：保证 TypeScript、DOM 操作和导入规范
- `Prettier`：统一格式
- `Vitest`：单元测试与模块级集成测试
- `jsdom`：模拟 DOM 环境，测试消息抽取、摘要生成、索引更新等逻辑
- `Playwright`：用于本地 mock 页面和扩展联调验证

## 3.3 为什么不在 MVP 引入重型前端框架

右侧导航栏是一个嵌入 ChatGPT 页面的小型浮层，交互复杂度有限。第一版优先选择 `原生 DOM + Shadow DOM`，原因如下：

1. 运行时更轻，注入页面的脚本体积更小
2. 更容易控制与宿主页面的样式隔离
3. 当前 UI 状态较简单，暂不需要复杂组件体系
4. 后续若增加设置页、搜索面板或收藏功能，再引入 `Preact` 或 `React` 也不晚

---

## 4. 总体架构

## 4.1 架构原则

1. 内容脚本只负责当前页面的识别、渲染和交互
2. 所有与 ChatGPT DOM 强相关的选择器统一集中管理
3. 数据层、观察层、UI 层、交互层分离，避免互相穿透
4. 导航 UI 使用独立根节点与 Shadow DOM，避免污染宿主页面样式
5. 所有重建逻辑必须有统一入口，避免多处重复扫描

## 4.2 运行流程

1. 内容脚本注入页面
2. 等待会话主容器出现
3. 扫描当前已渲染消息，抽取用户消息索引
4. 初始化右侧导航栏并渲染列表
5. 绑定 `MutationObserver` 监听消息变化
6. 绑定滚动同步逻辑，维护当前激活项
7. 用户交互触发跳转、高亮、tooltip 预览
8. 页面结构变化或会话切换时执行统一重建

---

## 5. 推荐项目结构

建议的目录结构如下：

```text
chatgpt-pins/
├─ docs/
│  ├─ chatgpt_message_navigation_prd_v1.md
│  └─ chatgpt_message_navigation_development_plan_v1.md
├─ public/
│  └─ icons/
│     ├─ icon-16.png
│     ├─ icon-48.png
│     └─ icon-128.png
├─ src/
│  ├─ manifest.ts
│  ├─ background/
│  │  └─ index.ts
│  ├─ content/
│  │  ├─ index.ts
│  │  ├─ bootstrap.ts
│  │  ├─ selectors.ts
│  │  ├─ observer.ts
│  │  ├─ extractor.ts
│  │  ├─ summary.ts
│  │  ├─ store.ts
│  │  ├─ navigator.ts
│  │  ├─ active-tracker.ts
│  │  ├─ highlighter.ts
│  │  ├─ theme.ts
│  │  └─ ui/
│  │     ├─ root.ts
│  │     ├─ panel.ts
│  │     ├─ tooltip.ts
│  │     └─ styles.css
│  ├─ shared/
│  │  ├─ types.ts
│  │  ├─ constants.ts
│  │  ├─ dom.ts
│  │  ├─ throttle.ts
│  │  └─ logger.ts
│  └─ tests/
│     ├─ fixtures/
│     │  ├─ chat-thread-basic.html
│     │  ├─ chat-thread-long.html
│     │  └─ chat-thread-rich-content.html
│     ├─ unit/
│     │  ├─ extractor.test.ts
│     │  ├─ summary.test.ts
│     │  ├─ store.test.ts
│     │  └─ active-tracker.test.ts
│     └─ e2e/
│        ├─ navigation.spec.ts
│        ├─ sync.spec.ts
│        └─ dynamic-update.spec.ts
├─ .eslintrc.cjs
├─ .prettierrc
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig.json
└─ vite.config.ts
```

---

## 6. 目录职责说明

### `src/manifest.ts`
扩展入口配置，定义名称、权限、匹配页面、content script 和 background。

### `src/background/`
当前 MVP 可只保留最小实现，用于未来承接设置、日志开关、版本迁移等能力。

### `src/content/bootstrap.ts`
内容脚本初始化入口，负责等待页面稳定、挂载 Shadow Root、启动观察器和 UI。

### `src/content/selectors.ts`
统一维护页面识别策略。所有与 ChatGPT DOM 结构耦合的逻辑必须集中在这里，便于后续适配改版。

### `src/content/extractor.ts`
负责从 DOM 中抽取消息节点，识别角色、生成唯一 ID、清洗文本内容。

### `src/content/summary.ts`
负责摘要生成和兜底逻辑，例如代码块消息显示“代码片段”，纯图片消息显示“非文本消息”。

### `src/content/store.ts`
负责维护内存态索引，提供增量更新、全量重建、激活项同步和订阅机制。

### `src/content/observer.ts`
封装 `MutationObserver`，对新增消息、局部重绘、会话切换做节流后的统一重建。

### `src/content/active-tracker.ts`
基于 `IntersectionObserver` 或节流滚动逻辑判断当前阅读位置，并同步激活导航项。

### `src/content/navigator.ts`
负责滚动定位、顶部偏移、平滑跳转和定位误差控制。

### `src/content/highlighter.ts`
负责目标消息的短时高亮效果和清理。

### `src/content/ui/`
负责面板、列表、tooltip、折叠按钮等所有注入式 UI。

### `src/tests/fixtures/`
用于保存模拟 ChatGPT 会话 DOM 的 HTML 样例，降低自动化测试对真实网站结构的依赖。

---

## 7. 模块设计建议

## 7.1 消息识别模块

职责：

- 找到消息列表容器
- 区分用户消息和助手消息
- 提取消息文本、顺序、DOM 引用、页面偏移
- 处理重复扫描、重渲染和无文本内容

建议实现：

- 使用集中式选择器策略
- 每条消息生成稳定 `id`
- 抽取结果输出为 `MessageAnchor[]`

## 7.2 索引管理模块

职责：

- 保存当前会话消息索引
- 处理新增、删除、重排
- 向 UI 广播状态变更

建议实现：

- 采用内存 store
- 对重建操作做去重和防抖
- 缓存上一次会话特征，检测会话是否切换

## 7.3 UI 模块

职责：

- 渲染右侧浮层
- 支持折叠 / 展开
- 显示编号、摘要、激活态
- 提供 tooltip

建议实现：

- UI 全部挂在 Shadow Root 下
- 使用 CSS Variables 做主题变量
- 面板宽度、边距、z-index 统一配置

## 7.4 跳转与高亮模块

职责：

- 点击导航项后平滑滚动到目标消息
- 修正顶部偏移
- 添加短暂高亮动画

建议实现：

- 使用 `scrollTo` + 平滑滚动
- 跳转后追加 class，高亮 1.5 到 2 秒后移除

## 7.5 动态更新模块

职责：

- 监听消息新增、局部重绘、会话切换
- 触发统一重建

建议实现：

- `MutationObserver` + 防抖
- 对高频 DOM 波动做合并处理
- 重建前检查宿主容器是否稳定

---

## 8. 数据结构建议

```ts
export type MessageRole = 'user' | 'assistant'

export type MessageAnchor = {
  id: string
  index: number
  role: MessageRole
  text: string
  summary: string
  element: HTMLElement
  topOffset: number
  timestamp?: string
}

export type NavigationState = {
  anchors: MessageAnchor[]
  activeId: string | null
  collapsed: boolean
  theme: 'light' | 'dark'
  conversationKey: string | null
}
```

---

## 9. 开发阶段计划

## 9.1 阶段一：工程初始化

目标：

- 初始化 `pnpm` 项目
- 配置 `TypeScript + Vite + CRXJS`
- 接入 `ESLint`、`Prettier`、`Vitest`
- 生成最小可加载扩展

交付物：

- 可运行的开发环境
- 可构建的浏览器扩展产物

## 9.2 阶段二：消息识别与基础跳转

目标：

- 抽取用户消息
- 渲染基础导航项
- 点击可跳转到目标消息

交付物：

- 基础导航 MVP

## 9.3 阶段三：预览、高亮和滚动同步

目标：

- 完成 tooltip 预览
- 完成目标高亮
- 完成当前激活项同步

交付物：

- 主要用户体验闭环

## 9.4 阶段四：动态更新与稳定性优化

目标：

- 支持新消息自动更新
- 支持会话切换重建
- 优化长会话性能

交付物：

- 可在真实 ChatGPT 长会话中持续使用的 MVP

## 9.5 阶段五：测试与发布准备

目标：

- 完成自动化测试
- 完成手动验证
- 完成生产构建与打包说明

交付物：

- 发布候选版本

---

## 10. 测试策略

测试分为 4 层：

1. 单元测试：验证纯函数和小模块逻辑
2. 模块集成测试：验证 DOM 抽取、索引更新和 UI 状态同步
3. E2E 测试：验证从导航点击到跳转高亮的完整链路
4. 真实环境手动测试：在真实 ChatGPT 页面验证兼容性和可用性

## 10.1 单元测试范围

重点覆盖以下内容：

- 摘要截断逻辑
- 代码块 / 非文本消息兜底文案
- 消息去重逻辑
- 会话切换识别逻辑
- 激活项选择算法
- 节流 / 防抖逻辑

## 10.2 集成测试范围

基于 `jsdom` 与本地 fixture 页面测试：

- 用户消息与助手消息区分是否正确
- 富文本、多段消息、代码块消息是否可抽取
- 导航项数量是否与用户消息数一致
- 动态插入新消息后索引是否更新
- 切换 mock 会话后旧状态是否清理

## 10.3 E2E 测试范围

基于 `Playwright` 执行：

- 扩展是否可成功注入页面
- 点击导航项后是否发生滚动
- 目标消息是否被高亮
- 手动滚动后激活项是否正确切换
- 折叠 / 展开是否正常

## 10.4 真实环境手动测试范围

重点覆盖：

- ChatGPT 深色 / 浅色主题
- 长会话
- 代码块密集场景
- 图片或非文本消息场景
- 新消息持续追加场景
- 切换到其他会话再切回场景

---

## 11. 测试步骤

## 11.1 本地开发启动

```bash
pnpm install
pnpm dev
```

预期结果：

- Vite 生成扩展开发产物
- 浏览器可加载未打包扩展目录

## 11.2 加载扩展

1. 打开 Chrome 或 Edge 的扩展管理页
2. 开启开发者模式
3. 选择“加载已解压的扩展程序”
4. 指向开发产物目录

## 11.3 自动化测试命令

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

建议定义如下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext .ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

## 11.4 手动验证步骤

在真实 ChatGPT 长会话页面中按以下顺序验证：

1. 打开一个消息数量较多的会话
2. 确认右侧导航栏已出现
3. 确认导航项仅对应用户消息
4. 悬停任一导航项，确认 tooltip 显示摘要
5. 点击任一导航项，确认平滑跳转到对应消息
6. 确认目标消息出现短时高亮
7. 手动滚动页面，确认当前激活项同步变化
8. 继续发送新消息，确认导航自动更新
9. 切换到另一个会话，确认旧导航不残留
10. 在深色和浅色模式下分别检查样式可读性

---

## 12. 验收清单

开发完成后，至少满足以下标准：

### 功能验收

- 能识别绝大多数用户消息
- 导航项数量基本正确
- 点击后能稳定跳转到目标消息
- 高亮反馈清晰
- 当前阅读位置同步稳定
- 新消息追加后能自动更新
- 会话切换后不会保留旧数据

### 性能验收

- 长会话滚动无明显卡顿
- 观察器不会导致频繁重建
- 展开 / 收起响应平稳

### UI 验收

- 不明显遮挡主内容
- 与滚动条冲突可控
- 深浅主题下文字和边框可辨识
- tooltip 不易超出可视范围

---

## 13. 关键风险与应对

## 13.1 ChatGPT DOM 结构变化

应对：

- 选择器集中维护
- 尽量优先使用稳定语义特征而不是脆弱 class 名
- 为识别失败场景增加日志开关和兜底策略

## 13.2 长会话性能下降

应对：

- 所有扫描和重建统一节流
- 仅在必要时重算位置信息
- 避免每次滚动都全量遍历消息

## 13.3 UI 与宿主页面冲突

应对：

- 使用 Shadow DOM 隔离样式
- 控制面板尺寸、z-index 和右侧边距
- 默认支持折叠

## 13.4 动态渲染导致状态错乱

应对：

- 统一重建入口
- 重建前检查容器稳定性
- 切换会话时主动清空旧状态

---

## 14. 发布建议

MVP 完成后，建议至少准备以下内容：

1. 扩展图标与基础说明文案
2. Chrome / Edge 安装说明
3. 已知兼容性限制说明
4. DOM 变更后的快速排查手册
5. 版本变更记录

---

## 15. 后续扩展建议

在不破坏当前结构的前提下，后续可以继续扩展：

1. 搜索过滤
2. 仅用户 / 仅助手 / 全部消息切换
3. 导航样式切换
4. 收藏与标记
5. 会话级导出
6. 设置页

为此，当前版本在实现时应提前保留：

- 可扩展的 `role` 字段
- 独立的 store 和 UI 渲染边界
- 最小 background 模块
- 清晰的 shared types

---

## 16. 建议结论

本项目适合以“轻量扩展 + 强约束工程结构”的方式推进。推荐先按本文档完成 MVP 脚手架和基础模块，再进入真实页面联调。第一版重点不是做复杂功能，而是保证以下三件事可靠：

1. 识别准
2. 跳得稳
3. 长会话下不拖慢页面

只要这三点成立，后续搜索、收藏、模式切换等增强功能都可以在现有结构上继续迭代。
