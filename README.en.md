# Online Toolbox

A free, open-source collection of online utility tools that can be deployed to Vercel with one click. All data processing happens locally in the browser to protect your privacy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ame420/toolbox)

## Live Demo

https://toolbox-roan-iota.vercel.app

## Features

- 🔤 **Chinese Converter**: Convert between Simplified, Traditional, Taiwan Traditional and Hong Kong Traditional Chinese
- 🔐 **Password Generator**: Generate strong passwords using cryptographically secure random numbers
- 🖼️ **Image to Text (OCR)**: Browser-local OCR powered by tesseract.js, no server upload
- 🎨 **Image RGB Picker**: Upload an image and click any pixel to extract HEX / RGB values
- 🔊 **Text to Speech**: Web Speech API with speed and pitch control
- 📅 **China / US Calendar**: Public holidays and makeup workdays for mainland China, US federal holidays
- 📝 **JSON Formatter**: Beautify, minify, validate, sort keys and custom indentation
- ⏰ **Timestamp Converter**: Convert Unix timestamps to Beijing time, auto-detect seconds/milliseconds
- 🔢 **Base64 Encoder/Decoder**: Supports non-ASCII characters including Chinese
- 📱 **QR Code Generator**: Generate QR codes from text/URLs with custom colors and download
- 🔍 **Regex Tester**: Real-time match highlighting with replacement preview
- 🎨 **Color Converter**: Convert between HEX / RGB / HSL / OKLCH with contrast checking
- 🧬 **JWT Decoder**: Decode JWT Header, Payload and Signature locally
- 📝 **Text Diff**: Highlight additions, deletions and unchanged content
- 📏 **Unit Converter**: Length, weight, temperature, data storage, area, volume
- 📝 **Markdown Editor**: Live Markdown preview with HTML export
- 🖼️ **Image Compressor**: Compress and convert images locally (JPG/PNG/WebP)
- #️⃣ **Hash Generator**: MD5 / SHA-1 / SHA-256 / SHA-512 text hashing
- 🧮 **Calculator**: Basic arithmetic, percentage, sign toggle with keyboard input
- 🌐 **API Request Tool**: Send HTTP requests with custom headers and body
- 🏋️ **BMI Calculator**: Calculate Body Mass Index from height and weight
- 📅 **Date Calculator**: Calculate days between dates and add/subtract days
- 📊 **Visitor Stats**: Busuanzi visitor counter showing UV and PV
- 🌐 **Multilingual**: Chinese / English language switch
- 🎨 **Multiple Themes**: Light, dark, blue and green themes
- 🏷️ **Category Filter**: Filter tools by category on the home page

## Tech Stack

- [Next.js 16](https://nextjs.org/) + App Router
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (based on @base-ui/react)
- [lucide-react](https://lucide.dev/) icons
- [opencc-js](https://github.com/yichengchen/opencc-js) Chinese conversion
- [tesseract.js](https://github.com/naptha/tesseract.js) browser OCR
- [lunar-javascript](https://github.com/6tail/lunar-javascript) lunar calendar
- [next-themes](https://github.com/pacocoursey/next-themes) theme management
- [@vercel/analytics](https://vercel.com/analytics) analytics
- [marked](https://marked.js.org/) + [isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify) Markdown rendering and sanitization
- [js-md5](https://github.com/emn178/js-md5) MD5 hashing

## Local Development

```bash
# Clone the repo
git clone https://github.com/ame420/toolbox.git
cd toolbox

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:3000.

## Common Commands

```bash
npm run dev      # Local development
npm run build    # Production build
npm run start    # Preview production build locally
npm run lint     # Lint code
```

## Deploy to Vercel

This project outputs a static site configured with `output: "export"` and `distDir: "dist"`. Deploy directly to Vercel:

```bash
vercel
```

Or click the **Deploy with Vercel** button above.

## Project Structure

```
toolbox/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (theme, i18n, Toaster)
│   ├── page.tsx            # Home: tool cards and category filter
│   ├── globals.css         # Global styles and theme variables
│   └── tools/              # Tool pages
│       ├── converter/      # Chinese converter
│       ├── password/       # Password generator
│       ├── ocr/            # Image to text
│       ├── rgb/            # Image RGB picker
│       ├── tts/            # Text to speech
│       ├── calendar-cn/    # China calendar
│       ├── calendar-us/    # US calendar
│       ├── json/           # JSON formatter
│       ├── timestamp/      # Timestamp converter
│       ├── base64/         # Base64 encoder/decoder
│       ├── qrcode/         # QR code generator
│       ├── regex/          # Regex tester
│       ├── color/          # Color converter
│       ├── jwt/            # JWT decoder
│       ├── diff/           # Text diff
│       ├── unit/           # Unit converter
│       ├── markdown/       # Markdown editor
│       ├── compress/       # Image compressor
│       ├── hash/           # Hash generator
│       ├── calculator/     # Calculator
│       ├── api-request/    # API request tool
│       ├── bmi/            # BMI calculator
│       └── date-calc/      # Date calculator
├── components/             # Shared components
│   ├── ui/                 # shadcn/ui components
│   ├── site-header.tsx     # Global header (language/theme toggle)
│   ├── category-filter.tsx # Category filter
│   ├── tool-card.tsx       # Tool card
│   ├── tool-layout.tsx     # Tool page layout
│   ├── calendar-view.tsx   # Calendar component
│   ├── page-header.tsx     # Page header
│   └── file-drop-zone.tsx  # Image drop/upload with paste support
├── lib/                    # Utilities and static data
│   ├── i18n.tsx            # i18n Context
│   ├── i18n-data.ts        # Chinese / English dictionary
│   ├── utils.ts            # cn and helpers
│   ├── holidays-cn.ts      # China public holidays
│   └── holidays-us.ts      # US holiday calculations
├── public/                 # Static assets
├── types/                  # Type definitions
├── CLAUDE.md               # Project notes and pitfalls
└── next.config.ts          # Next.js config
```

## Internationalization

A lightweight custom i18n solution (`lib/i18n.tsx` + `lib/i18n-data.ts`) supports Chinese and English switching. To add a new language:

1. Add a new language dictionary in `lib/i18n-data.ts`
2. Update the `Lang` type and default language logic in `lib/i18n.tsx`

## Themes

Four built-in themes: light, dark, blue and green. Theme variables are defined in `app/globals.css`, switching logic is in `components/theme-toggle.tsx`. To add a theme:

1. Add `.{theme-name}` and `.{theme-name}.dark` variables in `globals.css`
2. Add the new theme to the `THEMES` array in `components/theme-toggle.tsx`

## Contributing

Issues and PRs are welcome. If you build a new tool:

1. Add the tool info to the `TOOLS` array in `app/page.tsx`
2. Create `app/tools/<tool-name>/page.tsx`
3. Add Chinese and English strings in `lib/i18n-data.ts`

## License

[MIT](LICENSE)

---

Built with ❤️ using Next.js + Tailwind CSS + shadcn/ui.
