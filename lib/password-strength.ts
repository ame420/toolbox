/** 密码强度分析 */

export interface PasswordAnalysis {
  length: number;
  poolSize: number;
  entropy: number;
  score: number; // 0-4
  crackTimeSeconds: number;
  crackTimeDisplay: string;
  feedback: string[];
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

function formatCrackTime(seconds: number): string {
  if (seconds < 1e-3) return "< 1 毫秒";
  if (seconds < 1) return `${Math.round(seconds * 1000)} 毫秒`;
  if (seconds < 60) return `${Math.round(seconds)} 秒`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} 分钟`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} 小时`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} 天`;
  if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} 年`;
  if (seconds < 315360000000) return `${Math.round(seconds / 3153600000)} 世纪`;
  return "远超宇宙年龄";
}

function hasRepeatedChars(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

function hasSequentialChars(password: string): boolean {
  const lower = password.toLowerCase();
  for (let i = 0; i < lower.length - 2; i += 1) {
    const c1 = lower.charCodeAt(i);
    const c2 = lower.charCodeAt(i + 1);
    const c3 = lower.charCodeAt(i + 2);
    if (c2 === c1 + 1 && c3 === c2 + 1) return true;
    if (c2 === c1 - 1 && c3 === c2 - 1) return true;
  }
  for (let i = 0; i < lower.length - 2; i += 1) {
    const sub = lower.slice(i, i + 3);
    if (/^\d{3}$/.test(sub)) {
      const n1 = Number(sub[0]);
      const n2 = Number(sub[1]);
      const n3 = Number(sub[2]);
      if (n2 === n1 + 1 && n3 === n2 + 1) return true;
      if (n2 === n1 - 1 && n3 === n2 - 1) return true;
    }
  }
  return false;
}

export function analyzePassword(password: string, t: (key: string) => string): PasswordAnalysis {
  const length = password.length;

  let poolSize = 0;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = new RegExp(`[${SYMBOLS.replace(/[\\\[\]\-^]/g, "\\$&")}]`).test(password);
  const hasUnicode = /[^\x00-\x7F]/.test(password);

  if (hasLower) poolSize += LOWERCASE.length;
  if (hasUpper) poolSize += UPPERCASE.length;
  if (hasDigit) poolSize += DIGITS.length;
  if (hasSymbol) poolSize += SYMBOLS.length;
  if (hasUnicode) poolSize += 1000;

  if (poolSize === 0) poolSize = 1;

  const entropy = length * Math.log2(poolSize);

  // Offline fast hashing: ~100 billion guesses/sec
  const crackTimeSeconds = Math.pow(2, entropy) / 1e11;

  let score = 0;
  if (entropy >= 80) score = 4;
  else if (entropy >= 60) score = 3;
  else if (entropy >= 45) score = 2;
  else if (entropy >= 25) score = 1;

  const feedback: string[] = [];
  if (length < 12) feedback.push(t("passwordStrengthFeedbackLength"));
  if (!hasLower || !hasUpper) feedback.push(t("passwordStrengthFeedbackMixed"));
  if (!hasDigit) feedback.push(t("passwordStrengthFeedbackNumbers"));
  if (!hasSymbol && !hasUnicode) feedback.push(t("passwordStrengthFeedbackSymbols"));
  if (hasRepeatedChars(password)) feedback.push(t("passwordStrengthFeedbackNoRepeat"));
  if (hasSequentialChars(password)) feedback.push(t("passwordStrengthFeedbackNoSeq"));

  return {
    length,
    poolSize,
    entropy: Math.round(entropy * 10) / 10,
    score,
    crackTimeSeconds,
    crackTimeDisplay: formatCrackTime(crackTimeSeconds),
    feedback,
  };
}
