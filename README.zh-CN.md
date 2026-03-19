# ChatGPT Pins

面向 ChatGPT 长会话的消息级导航扩展。

`ChatGPT Pins` 是一个运行在 ChatGPT Web 端上的浏览器扩展。它会基于你自己发送过的消息，在页面右侧生成一个轻量导航面板，让你可以快速跳回之前的提示词、补充约束、代码片段和关键上下文，而不需要反复拖动滚动条。

[English](README.md) | 简体中文

## 快速开始（TL;DR）

运行环境：Node `>= 22`

```bash
npm install
npm run build
```

然后：

1. 打开 `chrome://extensions` 或 `edge://extensions`
2. 开启开发者模式
3. 点击 `加载已解压的扩展程序`
4. 选择 `dist/`
5. 打开 `https://chatgpt.com/*` 或 `https://chat.openai.com/*` 下的 ChatGPT 会话页面

本地开发：

```bash
npm run dev
```

打开：

```text
http://127.0.0.1:4173/playground/mock-chatgpt.html
```

## 为什么做这个项目

在长 ChatGPT 会话里，最难找回的往往不是助手回复，而是你自己前面发过的那条信息：

- 最初的需求
- 后来补充的限制条件
- 粘贴过的代码块
- 报错日志
- 某个分支问题的起点

ChatGPT 已经给了完整的消息流，但它并没有给出一个真正可用的“消息目录”。

`ChatGPT Pins` 的目标，就是为长会话补上这一层低干扰、可持续工作的消息级导航能力。

## 亮点

- 自动识别当前 ChatGPT 会话中的用户消息
- 在右侧生成悬浮导航面板
- 以 `编号 + 摘要` 的形式渲染消息锚点
- Hover 时显示预览
- 点击后平滑跳转到目标消息
- 跳转后短时高亮目标消息
- 根据当前阅读位置同步激活导航项
- 新消息追加后自动重建
- 会话切换后自动重建
- 支持浅色 / 深色主题
- 兼容真实 ChatGPT 页面里的内部滚动容器，而不是只假设 `window` 滚动

## 当前范围

当前仓库聚焦于第一版真正有用的功能闭环：

- 当前会话内导航
- 用户消息索引
- Hover 预览
- 点击跳转
- 当前项同步
- 动态刷新

暂不包含：

- 跨会话索引
- 全文搜索
- 收藏 / 书签
- 导出
- 云同步
- 设置页

## 已验证环境

目前的手动开发和真实站点联调，主要基于以下环境完成：

- macOS / MacBook
- Google Chrome

当前实现优先围绕 Chrome 做真实验证。Edge 仍然在目标支持范围内，但日常验证主要以 Chrome 为主。

## 从源码运行（开发）

克隆并安装依赖：

```bash
git clone https://github.com/zikangliang/chatgpt-pins.git
cd chatgpt-pins
npm install
```

启动本地 playground：

```bash
npm run dev
```

构建扩展：

```bash
npm run build
```

开发时持续 watch 扩展构建：

```bash
npm run dev:extension
```

## 加载到浏览器

构建产物位于 `dist/`。

在 Chrome 或 Edge 中加载：

1. 打开 `chrome://extensions` 或 `edge://extensions`
2. 开启开发者模式
3. 点击 `加载已解压的扩展程序`
4. 选择 `dist/` 目录
5. 打开 ChatGPT 会话页

支持的域名：

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`

如果你重新构建了项目：

1. 执行 `npm run build`
2. 在扩展管理页点击 `重新加载`
3. 回到 ChatGPT 标签页强制刷新

## 开发流程

这个项目主要有两条开发回路：

### 1. UI / 交互回路

用本地 playground 来迭代：

- 面板渲染
- 点击跳转
- 当前项同步
- 动态更新
- 内部滚动容器行为

命令：

```bash
npm run dev
```

### 2. 真实扩展验证回路

把构建好的扩展加载到真实 ChatGPT 网站，验证：

- DOM 选择器稳定性
- content script 注入
- host 权限
- 真实会话渲染行为
- ChatGPT 页面布局变化后的兼容性

命令：

```bash
npm run build
```

## 脚本

```bash
npm run dev
npm run dev:playground
npm run dev:extension
npm run lint
npm run test
npm run test:e2e
npm run build
```

说明：

- `npm run dev`
  启动本地 playground 调试服务。
- `npm run dev:playground`
  显式使用 playground 专用 Vite 配置。
- `npm run dev:extension`
  以 watch 模式持续构建扩展。
- `npm run lint`
  运行 ESLint。
- `npm run test`
  运行 Vitest 单元测试。
- `npm run test:e2e`
  运行 Playwright 端到端测试。
- `npm run build`
  构建 MV3 扩展，并校验生成 bundle 的 JS 语法。

## 测试策略

当前测试分为三层：

### 单元测试

重点覆盖：

- 消息抽取
- 摘要生成
- 导航状态
- 滚动辅助逻辑
- 当前激活锚点选择

### E2E 测试

重点覆盖：

- 面板渲染
- 点击跳转
- 当前项同步
- 新消息后的动态更新
- 会话切换

### 真实站点验证

重点覆盖：

- content script 注入
- 真实 ChatGPT DOM 的选择器兼容性
- host 权限行为
- 内部滚动容器兼容性

## 真实站点验证清单

在真实 ChatGPT 会话页建议按下面顺序检查：

1. 右侧出现 `ChatGPT Pins` 面板
2. 面板只列出用户消息
3. Hover 时摘要 / 预览符合预期
4. 点击任意项后，页面滚动到正确消息
5. 跳转后目标消息有高亮
6. 手动滚动时激活项同步变化
7. 发送新消息后列表自动刷新
8. 切换到其他会话后面板会清空并重建

## 架构

代码结构按扩展的真实职责拆分：

```text
.
├─ docs/                  产品与开发文档
├─ playground/            本地 mock ChatGPT 页面
├─ src/
│  ├─ background/         MV3 后台脚本
│  ├─ content/            内容脚本、导航逻辑、注入 UI
│  ├─ shared/             类型、常量、DOM / scroll 工具
│  └─ tests/              单元测试、fixture、E2E
├─ dist/                  构建产物
└─ public/                静态资源
```

核心模块：

- `src/content/extractor.ts`
  从渲染后的会话 DOM 中抽取用户消息锚点。
- `src/content/navigator.ts`
  处理点击后的滚动定位。
- `src/content/active-tracker.ts`
  追踪当前阅读位置并同步导航激活项。
- `src/content/ui/`
  负责浮层面板、tooltip、样式和 Shadow DOM 注入。
- `src/shared/scroll.ts`
  负责解析页面真正使用的滚动容器。

## 调试

在 ChatGPT 页面控制台里，优先看这两个值：

```js
window.__chatgptPinsBootstrapped__
document.getElementById('chatgpt-pins-root')
```

预期：

- `window.__chatgptPinsBootstrapped__ === true`
- `document.getElementById('chatgpt-pins-root')` 返回注入根节点

一条比较实用的排查路径：

1. 根节点不存在：优先怀疑注入或 host 权限
2. 根节点存在但没有列表：优先怀疑选择器失配
3. 列表存在但点击不动：优先怀疑滚动容器识别

## 构建说明

`npm run build` 不只是产出 `dist/`。

它还会在构建完成后对生成的 JavaScript bundle 做语法检查。这一层是后面专门补上的，用来防止出现“构建看起来成功，但 content script 运行即报语法错误”的隐蔽问题。

## 当前限制

- ChatGPT DOM 结构可能随时变化
- 选择器层需要持续维护
- 当前版本优先支持桌面端 Web 使用
- 当前实现是本地优先、会话级别的导航增强

## Roadmap

后续比较可能继续扩展：

- 面板内搜索 / 过滤
- 仅用户 / 仅助手 / 全消息模式
- 可切换的导航展示样式
- 收藏 / 书签
- 设置页
- 跨会话导航

## 文档

- 产品需求文档：[`docs/chatgpt_message_navigation_prd_v1.md`](docs/chatgpt_message_navigation_prd_v1.md)
- 开发计划文档：[`docs/chatgpt_message_navigation_development_plan_v1.md`](docs/chatgpt_message_navigation_development_plan_v1.md)
