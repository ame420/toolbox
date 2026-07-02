/** 常见设备屏幕尺寸参考数据 */

export interface ScreenDevice {
  name: string;
  resolution: string;
  dpi?: number;
  type?: "phone" | "tablet" | "laptop" | "desktop" | "wearable";
}

export interface ScreenCategory {
  id: string;
  nameZh: string;
  nameEn: string;
  devices: ScreenDevice[];
}

export const SCREEN_CATEGORIES: ScreenCategory[] = [
  {
    id: "phone",
    nameZh: "手机",
    nameEn: "Phones",
    devices: [
      { name: "iPhone SE", resolution: "750 × 1334", dpi: 326 },
      { name: "iPhone 14", resolution: "1170 × 2532", dpi: 460 },
      { name: "iPhone 14 Pro", resolution: "1179 × 2556", dpi: 460 },
      { name: "iPhone 14 Pro Max", resolution: "1290 × 2796", dpi: 460 },
      { name: "iPhone 15 Pro Max", resolution: "1290 × 2796", dpi: 460 },
      { name: "Samsung Galaxy S24", resolution: "1080 × 2340", dpi: 416 },
      { name: "Samsung Galaxy S24 Ultra", resolution: "1440 × 3120", dpi: 505 },
      { name: "Google Pixel 8", resolution: "1080 × 2400", dpi: 428 },
      { name: "Google Pixel 8 Pro", resolution: "1344 × 2992", dpi: 489 },
      { name: "Xiaomi 14", resolution: "1200 × 2670", dpi: 460 },
      { name: "Huawei Mate 60 Pro", resolution: "1260 × 2720", dpi: 460 },
      { name: "OnePlus 12", resolution: "1440 × 3168", dpi: 510 },
    ],
  },
  {
    id: "tablet",
    nameZh: "平板",
    nameEn: "Tablets",
    devices: [
      { name: "iPad mini", resolution: "1488 × 2266", dpi: 326 },
      { name: "iPad Air", resolution: "1640 × 2360", dpi: 264 },
      { name: "iPad Pro 11\"", resolution: "1668 × 2388", dpi: 264 },
      { name: "iPad Pro 12.9\"", resolution: "2048 × 2732", dpi: 264 },
      { name: "Samsung Galaxy Tab S9", resolution: "1600 × 2560", dpi: 274 },
      { name: "Samsung Galaxy Tab S9 Ultra", resolution: "1848 × 2960", dpi: 296 },
      { name: "Xiaomi Pad 6", resolution: "1800 × 2880", dpi: 309 },
      { name: "Lenovo Tab P12", resolution: "1600 × 2560", dpi: 243 },
    ],
  },
  {
    id: "laptop",
    nameZh: "笔记本",
    nameEn: "Laptops",
    devices: [
      { name: "MacBook Air 13\"", resolution: "2560 × 1664", dpi: 227 },
      { name: "MacBook Air 15\"", resolution: "2880 × 1864", dpi: 224 },
      { name: "MacBook Pro 14\"", resolution: "3024 × 1964", dpi: 254 },
      { name: "MacBook Pro 16\"", resolution: "3456 × 2234", dpi: 254 },
      { name: "Dell XPS 13", resolution: "1920 × 1200", dpi: 169 },
      { name: "Dell XPS 15", resolution: "1920 × 1200", dpi: 145 },
      { name: "ThinkPad X1 Carbon", resolution: "1920 × 1200", dpi: 162 },
      { name: "Surface Laptop 5", resolution: "2256 × 1504", dpi: 201 },
    ],
  },
  {
    id: "desktop",
    nameZh: "显示器",
    nameEn: "Monitors",
    devices: [
      { name: "1080p (Full HD)", resolution: "1920 × 1080" },
      { name: "1440p (QHD)", resolution: "2560 × 1440" },
      { name: "4K UHD", resolution: "3840 × 2160" },
      { name: "5K", resolution: "5120 × 2880" },
      { name: "8K UHD", resolution: "7680 × 4320" },
      { name: "Ultrawide 21:9", resolution: "2560 × 1080" },
      { name: "Ultrawide 21:9", resolution: "3440 × 1440" },
      { name: "Ultrawide 32:9", resolution: "5120 × 1440" },
    ],
  },
  {
    id: "wearable",
    nameZh: "可穿戴",
    nameEn: "Wearables",
    devices: [
      { name: "Apple Watch 41mm", resolution: "352 × 430", dpi: 326 },
      { name: "Apple Watch 45mm", resolution: "396 × 484", dpi: 326 },
      { name: "Apple Watch Ultra", resolution: "410 × 502", dpi: 338 },
      { name: "Samsung Galaxy Watch 6", resolution: "480 × 480", dpi: 327 },
      { name: "Garmin Fenix 7", resolution: "260 × 260", dpi: 283 },
      { name: "Huawei Watch GT 4", resolution: "466 × 466", dpi: 326 },
    ],
  },
];
