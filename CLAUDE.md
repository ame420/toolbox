# 在线小工具箱（Online Toolbox）

## 一句话描述

一个基于 Next.js 的在线实用小工具集合，支持中文简繁转换、随机密码生成、图片 OCR、图片 RGB 提取、文字语音朗读、中/美日历（含法定节假日）、JSON 格式化、时间戳转换与 Base64 编解码，可一键部署至 Vercel。

## 技术栈

- **框架**：Next.js 16+（App Router）
- **语言**：TypeScript 5+
- **样式**：Tailwind CSS v4
- **UI 组件**：shadcn/ui（基于 @base-ui/react）
- **图标**：lucide-react
- **工具库**：
  - `opencc-js`：中文简繁体转换
  - `tesseract.js`：浏览器端图片文字识别（OCR）
  - 浏览器原生 API：Web Speech API（语音朗读）、Canvas（RGB 提取）
- **部署**：Vercel（静态站点，默认输出 `dist`）

## 项目结构

```
toolbox/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局（主题、字体、Toaster）
│   ├── page.tsx                  # 首页：工具导航卡片
│   ├── globals.css               # 全局样式与 Tailwind 主题变量
│   └── tools/                    # 各工具页面，每个工具一个目录
│       ├── converter/page.tsx    # 中文简繁体转换
│       ├── password/page.tsx     # 随机密码生成
│       ├── ocr/page.tsx          # 图片文字识别（OCR）
│       ├── rgb/page.tsx          # 图片 RGB 提取
│       ├── tts/page.tsx          # 文字语音朗读
│       ├── calendar-cn/page.tsx  # 中国大陆日历（含法定节假日）
│       ├── calendar-us/page.tsx  # 美国日历（含法定节假日）
│       ├── json/page.tsx         # JSON 格式化
│       ├── timestamp/page.tsx    # 时间戳转换
│       └── base64/page.tsx       # Base64 编解码
├── components/                   # 公共组件
│   ├── ui/                       # shadcn/ui 组件
│   ├── tool-card.tsx             # 首页工具入口卡片
│   ├── page-header.tsx           # 工具页面通用头部（标题、返回）
│   └── file-drop-zone.tsx        # 图片拖拽/选择上传区域
├── lib/                          # 工具函数与静态数据
│   ├── utils.ts                  # cn 等通用工具
│   ├── holidays-cn.ts            # 中国法定节假日数据与查询
│   └── holidays-us.ts            # 美国法定节假日计算
├── hooks/                        # 自定义 React Hooks
├── public/                       # 静态资源
│   └── traineddata/              # tesseract.js 训练数据（按需放置）
├── types/                        # 类型定义
├── CLAUDE.md                     # 本文件
├── README.md
├── next.config.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 常用命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint

# 本地预览生产构建
npm run build && npm start
```

## 代码风格规范

### 命名

- **React 组件**：PascalCase，例如 `ToolCard`、`OcrPage`。
- **页面文件**：`page.tsx`（Next.js 约定）。
- **工具函数/变量**：camelCase，例如 `formatJson`、`copyToClipboard`。
- **常量**：UPPER_SNAKE_CASE，例如 `MAX_FILE_SIZE`、`CN_HOLIDAYS_2025`。
- **类型/接口**：PascalCase，例如 `ToolMeta`、`Holiday`。

### 文件与目录

- 每个工具独占 `app/tools/<tool-name>/page.tsx`。
- 工具专属的可复用逻辑抽离到同目录或 `lib/`、`hooks/` 下。
- 静态数据（如节假日）统一放到 `lib/` 下，按年份/国家拆分。

### 注释

- 复杂算法、正则或业务规则需在函数上方加简短注释说明用途。
- 组件顶部注释说明功能与主要 props（可选）。
- 避免无意义的注释。

### 类型

- 优先使用 TypeScript 类型，避免 `any`。
- 对第三方库无类型定义时，使用 `// @ts-ignore` 并附带原因，或补充 `.d.ts` 声明。

### 样式

- 统一使用 Tailwind CSS 工具类，尽量不写自定义 CSS。
- 复杂条件类名使用 `cn()` 辅助函数组合。
- 颜色优先使用主题变量，如 `bg-primary`、`text-muted-foreground`。

### 交互与状态

- 表单/输入使用受控组件，状态变化即时反馈。
- 复制、成功、错误等操作使用 `sonner` Toast 提示。
- 耗时操作（如 OCR）显示加载状态与进度。

### 性能与部署

- 优先纯浏览器端计算，减少服务端依赖。
- OCR 等重型功能按需加载语言包，限制上传文件大小。
- 生产构建输出为静态站点，适配 Vercel 默认配置。

## 踩坑记录

### 1. shadcn/ui + Tailwind CSS v4：SVG 尺寸选择器导致 CSS 解析失败

**现象**：本地运行或构建时浏览器控制台报错：

```
Parsing CSS source code failed
Unexpected token CurlyBracketBlock
svg:not([class*=&#x27;size-&#x27;]) {
```

**原因**：shadcn/ui 自动生成的 Button、Select、Tabs、Alert 等组件中使用了复杂选择器：

```css
[&_svg:not([class*='size-'])]:size-4
```

该选择器内部包含单引号，与 Tailwind CSS v4 / Turbopack 的 CSS 生成器不兼容，导致生成的 CSS 中引号被错误转义，浏览器解析失败。

**解决方案**：将 `components/ui/` 中所有含 `svg:not([class*='size-'])` 的选择器替换为更简单的写法：

```css
/* 修改前（不兼容） */
[&_svg:not([class*='size-'])]:size-4
*:[svg:not([class*='size-'])]:size-4

/* 修改后（兼容） */
[&_svg]:size-4
*:[svg]:size-4
```

**涉及文件**：
- `components/ui/button.tsx`
- `components/ui/select.tsx`
- `components/ui/tabs.tsx`
- `components/ui/alert.tsx`

**验证**：修改后重新启动开发服务器（必要时清空 `.next` 与 `dist` 缓存），页面可正常加载且无 CSS 解析报错。

### 2. 构建环境无法访问 Google Fonts

**现象**：`npm run build` 时报错，无法下载 Geist 字体文件。

**原因**：当前构建环境无法访问 `fonts.gstatic.com`。

**解决方案**：`app/layout.tsx` 中移除 `next/font/google` 的 Geist 字体导入，`app/globals.css` 改用系统字体栈，减少外部依赖并提升加载速度。

### 3. opencc-js 类型定义与实际 API 不符

**现象**：TypeScript 报错 `Argument of type 'string' is not assignable to parameter of type 'ConverterOptions'`。

**原因**：`@types/opencc-js` 的 `Converter` 类型只声明了对象参数，而 `opencc-js` 实际支持传入配置名字符串（如 `'s2tw'`）。

**解决方案**：调用时做类型断言：

```ts
const converter = (OpenCC as unknown as { Converter: (config: string) => (text: string) => string }).Converter(mode);
```

### 4. lunar-javascript 缺少类型声明

**现象**：TypeScript 报错 `Could not find a declaration file for module 'lunar-javascript'`。

**解决方案**：在 `types/lunar-javascript.d.ts` 中补充模块声明。

### 5. next-themes 自定义主题切换后无法切回默认主题

**现象**：使用 `next-themes` 的 `attribute="class"` 支持多套主题（如 `light`、`dark`、`theme-blue`、`theme-green`）时，从 `theme-green` 切回 `light` 后页面仍显示绿色主题。

**原因**：`next-themes` 在切换到非默认主题时会替换默认 class，但从自定义主题切回 `defaultTheme`（此处为 `light`）时，不会自动清理旧的自定义主题 class，导致 `<html>` 上同时存在多个主题类，例如：

```
class="h-full antialiased theme-green light"
```

由于 `.theme-green` 的 CSS 变量优先级与 `:root` 相同且后定义，覆盖了浅色主题变量，因此浅色未生效。

**解决方案**：在切换主题前手动清理所有已知的主题 class，再调用 `setTheme`：

```tsx
const THEMES = [
  { id: "light" },
  { id: "dark" },
  { id: "theme-blue" },
  { id: "theme-green" },
];

const handleChange = (id: string) => {
  const root = document.documentElement;
  THEMES.forEach(({ id }) => root.classList.remove(id));
  setTheme(id);
};
```

**相关文件**：
- `components/theme-toggle.tsx`
- `app/layout.tsx` 中的 `ThemeProvider` 配置

**验证**：依次切换 浅色 → 绿色 → 浅色 → 蓝色 → 深色 → 浅色，检查 `<html>` 的 `class` 只保留当前主题类，且背景色变量恢复为 `:root` 定义值。

