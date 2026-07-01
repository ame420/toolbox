/** 中国大陆居民身份证校验与解析 */

export interface IdCardResult {
  valid: boolean;
  error?: string;
  province?: string;
  birthDate?: string;
  gender?: string;
  age?: number;
  checkDigit?: string;
}

const PROVINCE_CODES: Record<string, string> = {
  "11": "北京",
  "12": "天津",
  "13": "河北",
  "14": "山西",
  "15": "内蒙古",
  "21": "辽宁",
  "22": "吉林",
  "23": "黑龙江",
  "31": "上海",
  "32": "江苏",
  "33": "浙江",
  "34": "安徽",
  "35": "福建",
  "36": "江西",
  "37": "山东",
  "41": "河南",
  "42": "湖北",
  "43": "湖南",
  "44": "广东",
  "45": "广西",
  "46": "海南",
  "50": "重庆",
  "51": "四川",
  "52": "贵州",
  "53": "云南",
  "54": "西藏",
  "61": "陕西",
  "62": "甘肃",
  "63": "青海",
  "64": "宁夏",
  "65": "新疆",
  "71": "台湾",
  "81": "香港",
  "82": "澳门",
};

const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECK_DIGITS = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function parseBirthDate(code: string): { birthDate: string; age: number } | null {
  const year = Number(code.slice(0, 4));
  const month = Number(code.slice(4, 6));
  const day = Number(code.slice(6, 8));

  if (!isValidDate(year, month, day)) return null;

  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return { birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, age };
}

export function validateIdCard(input: string): IdCardResult {
  const trimmed = input.trim();

  if (!/^\d{15}$|^\d{17}[\dXx]$/.test(trimmed)) {
    return { valid: false, error: "length" };
  }

  const normalized = trimmed.toUpperCase();
  const is18 = normalized.length === 18;

  // Province code
  const provinceCode = normalized.slice(0, 2);
  if (!PROVINCE_CODES[provinceCode]) {
    return { valid: false, error: "province" };
  }

  // Birth date
  const dateCode = is18 ? normalized.slice(6, 14) : `19${normalized.slice(6, 12)}`;
  const birthInfo = parseBirthDate(dateCode);
  if (!birthInfo) {
    return { valid: false, error: "date" };
  }

  // 15-digit legacy card: no check digit
  if (!is18) {
    const seqCode = Number(normalized.slice(12, 15));
    return {
      valid: true,
      province: PROVINCE_CODES[provinceCode],
      birthDate: birthInfo.birthDate,
      gender: seqCode % 2 === 1 ? "male" : "female",
      age: birthInfo.age,
    };
  }

  // 18-digit check digit
  let sum = 0;
  for (let i = 0; i < 17; i += 1) {
    sum += Number(normalized[i]) * WEIGHTS[i];
  }
  const expected = CHECK_DIGITS[sum % 11];
  if (expected !== normalized[17]) {
    return { valid: false, error: "check" };
  }

  const seqCode = Number(normalized.slice(14, 17));
  return {
    valid: true,
    province: PROVINCE_CODES[provinceCode],
    birthDate: birthInfo.birthDate,
    gender: seqCode % 2 === 1 ? "male" : "female",
    age: birthInfo.age,
    checkDigit: expected,
  };
}
