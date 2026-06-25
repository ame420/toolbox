# 在线小工具箱 · Online Toolbox

一个免费、开源、可一键部署到 Vercel 的在线实用小工具集合。所有数据处理均在浏览器本地完成，保护隐私。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ame420/toolbox)

## 在线演示

https://toolbox-roan-iota.vercel.app

## 功能特性

- 🔤 **中文简繁转换**：支持简体、繁体、台湾繁体、香港繁体相互转换
- 🔐 **随机密码生成**：使用浏览器加密安全随机数，支持自定义长度与字符类型
- 🖼️ **图片转文字（OCR）**：基于 tesseract.js，浏览器本地识别，无需上传服务器
- 🎨 **图片 RGB 提取**：上传图片，点击任意像素提取 HEX / RGB 色值
- 🔊 **文字语音朗读**：使用 Web Speech API，支持语速、音调调节
- 📅 **中/美日历**：标注中国大陆法定节假日、调休与美国联邦节假日
- 📝 **JSON 格式化**：美化、压缩、校验，支持按键排序与自定义缩进
- ⏰ **时间戳转换**：Unix 时间戳与北京时间相互转换，自动识别秒/毫秒
- 🔢 **Base64 编解码**：支持中文等非 ASCII 字符
- 📱 **二维码生成器**：文本/URL 一键生成二维码，支持自定义颜色与下载
- 🔍 **正则表达式测试器**：实时高亮匹配结果，支持替换预览
- 🎨 **颜色转换器**：HEX / RGB / HSL / OKLCH 互转，自动检查对比度
- 🧬 **JWT 解码器**：本地解析 JWT 的 Header、Payload 与 Signature
- 📝 **文本对比**：高亮两段文本的新增、删除与相同内容
- 📏 **单位换算器**：长度、重量、温度、数据存储、面积、体积换算
- 📝 **Markdown 编辑器**：实时预览 Markdown，支持导出 HTML
- 🖼️ **图片压缩**：浏览器端压缩并转换图片格式（JPG/PNG/WebP）
- #️⃣ **哈希生成器**：MD5 / SHA-1 / SHA-256 / SHA-512 文本哈希
- 🧮 **计算器**：支持基本四则运算、百分比、正负号切换，键盘输入
- 🌐 **API 请求工具**：发送 HTTP 请求并查看响应，支持自定义请求头与请求体
- 📍 **IP 信息查询**：查询本机公网 IP 地址及地理位置、运营商等详细信息
- 🏋️ **BMI 计算器**：根据身高体重计算身体质量指数，判断体型
- 📅 **日期计算器**：计算两个日期相差天数，支持日期加减运算
- 📊 **访问统计**：不蒜子访客计数器，显示 UV 与 PV
- 🌐 **多语言**：支持中文 / 英文切换
- 🎨 **多主题**：浅色、深色、蓝色、绿色四种主题
- 🏷️ **分类筛选**：首页支持按工具类型筛选

## 技术栈

- [Next.js 16](https://nextjs.org/) + App Router
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)（基于 @base-ui/react）
- [lucide-react](https://lucide.dev/) 图标
- [opencc-js](https://github.com/yichengchen/opencc-js) 中文简繁转换
- [tesseract.js](https://github.com/naptha/tesseract.js) 浏览器端 OCR
- [lunar-javascript](https://github.com/6tail/lunar-javascript) 农历计算
- [next-themes](https://github.com/pacocoursey/next-themes) 主题管理
- [@vercel/analytics](https://vercel.com/analytics) 访问统计
- [marked](https://marked.js.org/) + [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify) Markdown 渲染与消毒
- [js-md5](https://github.com/emn178/js-md5) MD5 计算

## 本地开发

```bash
# 克隆项目
git clone https://github.com/ame420/toolbox.git
cd toolbox

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 即可访问。

## 常用命令

```bash
npm run dev      # 本地开发
npm run build    # 生产构建
npm run start    # 本地预览生产构建
npm run lint     # 代码检查
```

## 部署到 Vercel

本项目输出为静态站点，已配置 `output: "export"` 和 `distDir: "dist"`，可直接部署到 Vercel：

```bash
vercel
```

或点击上方 **Deploy with Vercel** 按钮一键部署。

## 项目结构

```
toolbox/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局（主题、国际化、Toaster）
│   ├── page.tsx            # 首页：工具导航卡片与分类筛选
│   ├── globals.css         # 全局样式与主题变量
│   └── tools/              # 各工具页面
│       ├── converter/      # 中文简繁转换
│       ├── password/       # 随机密码生成
│       ├── ocr/            # 图片转文字
│       ├── rgb/            # 图片 RGB 提取
│       ├── tts/            # 文字语音朗读
│       ├── calendar-cn/    # 中国大陆日历
│       ├── calendar-us/    # 美国日历
│       ├── json/           # JSON 格式化
│       ├── timestamp/      # 时间戳转换
│       ├── base64/         # Base64 编解码
│       ├── qrcode/         # 二维码生成器
│       ├── regex/          # 正则表达式测试器
│       ├── color/          # 颜色转换器
│       ├── jwt/            # JWT 解码器
│       ├── diff/           # 文本对比
│       ├── unit/           # 单位换算器
│       ├── markdown/       # Markdown 编辑器
│       ├── compress/       # 图片压缩
│       ├── hash/           # 哈希生成器
│       ├── calculator/     # 计算器
│       ├── api-request/    # API 请求工具
│       ├── ip-info/        # IP 信息查询
│       ├── bmi/            # BMI 计算器
│       └── date-calc/      # 日期计算器
├── components/             # 公共组件
│   ├── ui/                 # shadcn/ui 组件
│   ├── site-header.tsx     # 全局头部（语言/主题切换）
│   ├── category-filter.tsx # 分类筛选
│   ├── tool-card.tsx       # 工具卡片
│   ├── tool-layout.tsx     # 工具页面布局
│   ├── calendar-view.tsx   # 日历组件
│   ├── page-header.tsx     # 页面头部
│   └── file-drop-zone.tsx  # 图片拖拽上传
├── lib/                    # 工具函数与静态数据
│   ├── i18n.tsx            # 国际化 Context
│   ├── i18n-data.ts        # 中英文字典
│   ├── utils.ts            # cn 等通用工具
│   ├── holidays-cn.ts      # 中国法定节假日
│   └── holidays-us.ts      # 美国法定节假日计算
├── public/                 # 静态资源
├── types/                  # 类型定义
├── CLAUDE.md               # 项目说明与踩坑记录
└── next.config.ts          # Next.js 配置
```

## 国际化

项目使用轻量级自定义 i18n 方案（`lib/i18n.tsx` + `lib/i18n-data.ts`），支持中文和英文切换。新增语言时只需：

1. 在 `lib/i18n-data.ts` 中添加新的语言字典
2. 更新 `lib/i18n.tsx` 中的 `Lang` 类型与默认语言逻辑

## 主题

项目内置 4 套主题：浅色、深色、蓝色、绿色。主题变量定义在 `app/globals.css` 中，切换逻辑在 `components/theme-toggle.tsx`。新增主题时：

1. 在 `globals.css` 中添加 `.{theme-name}` 与 `.{theme-name}.dark` 变量
2. 在 `components/theme-toggle.tsx` 的 `THEMES` 数组中添加新主题

## 贡献

欢迎提交 Issue 和 PR。如果你开发了新的小工具，可以：

1. 在 `app/page.tsx` 的 `TOOLS` 数组中添加工具信息
2. 创建 `app/tools/<tool-name>/page.tsx`
3. 在 `lib/i18n-data.ts` 中补充中英文字符串

## 开源协议

[MIT](LICENSE)

---

Built with ❤️ using Next.js + Tailwind CSS + shadcn/ui.
