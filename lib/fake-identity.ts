/** 虚拟身份生成数据 */

const SURNAMES = [
  "王", "李", "张", "刘", "陈", "杨", "黄", "赵", "周", "吴",
  "徐", "孙", "马", "朱", "胡", "郭", "何", "林", "罗", "高",
  "郑", "梁", "谢", "宋", "唐", "许", "邓", "韩", "冯", "曹",
];

const MALE_NAMES = [
  "伟", "强", "磊", "军", "洋", "勇", "杰", "涛", "超", "明",
  "辉", "刚", "建", "峰", "宇", "浩", "鑫", "毅", "林", "斌",
];

const FEMALE_NAMES = [
  "芳", "娜", "敏", "静", "丽", "强", "洁", "雪", "颖", "慧",
  "艳", "霞", "秀", "英", "玲", "梅", "兰", "燕", "华", "婷",
];

const EMAIL_DOMAINS = [
  "example.com", "test.com", "demo.org", "mail.cn", "email.net",
];

const CITIES = [
  "北京市", "上海市", "广州市", "深圳市", "杭州市", "南京市", "成都市", "武汉市",
  "西安市", "重庆市", "天津市", "苏州市", "郑州市", "长沙市", "青岛市", "厦门市",
];

const DISTRICTS = [
  "朝阳区", "海淀区", "天河区", "南山区", "西湖区", "鼓楼区", "锦江区", "江汉区",
  "雁塔区", "渝中区", "和平区", "工业园区", "金水区", "芙蓉区", "市南区", "思明区",
];

const STREETS = [
  "建设大街", "解放路", "人民路", "中山路", "南京路", "北京路", "长安街", "延安路",
  "和平大道", "友谊路", "胜利街", "光明路", "文化路", "工业大道", "迎宾大道", "学府路",
];

const PHONE_PREFIXES = [
  "138", "139", "135", "136", "137", "150", "151", "152", "157", "158", "159", "182", "183", "187", "188",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export interface FakeIdentity {
  name: string;
  gender: string;
  idCard: string;
  phone: string;
  email: string;
  address: string;
}

export function generateFakeIdentity(t: (key: string) => string): FakeIdentity {
  const isMale = Math.random() > 0.5;
  const surname = randomItem(SURNAMES);
  const givenName = randomItem(isMale ? MALE_NAMES : FEMALE_NAMES);
  const name = surname + givenName;

  const year = 1980 + Math.floor(Math.random() * 30);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  const seq = randomDigits(3);

  const birthCode = `${year}${month}${day}`;
  const base = randomItem(["11", "31", "44", "33", "42", "32", "51", "50", "61", "37"]) + "0" + randomDigits(2) + birthCode + seq;

  // Simple check digit calculation
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkDigits = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
  let sum = 0;
  for (let i = 0; i < 17; i += 1) {
    sum += Number(base[i]) * weights[i];
  }
  const idCard = base + checkDigits[sum % 11];

  const phone = randomItem(PHONE_PREFIXES) + randomDigits(8);
  const email = `${pinyin(name)}${randomDigits(4)}@${randomItem(EMAIL_DOMAINS)}`;
  const address = `${randomItem(CITIES)}${randomItem(DISTRICTS)}${randomItem(STREETS)}${randomDigits(3)}号`;

  return {
    name,
    gender: isMale ? t("fakeIdentityMale") : t("fakeIdentityFemale"),
    idCard,
    phone,
    email,
    address,
  };
}

function pinyin(name: string): string {
  // Simplified pinyin-ish representation for email local part
  const map: Record<string, string> = {
    王: "wang", 李: "li", 张: "zhang", 刘: "liu", 陈: "chen",
    杨: "yang", 黄: "huang", 赵: "zhao", 周: "zhou", 吴: "wu",
    徐: "xu", 孙: "sun", 马: "ma", 朱: "zhu", 胡: "hu",
    郭: "guo", 何: "he", 林: "lin", 罗: "luo", 高: "gao",
    郑: "zheng", 梁: "liang", 谢: "xie", 宋: "song", 唐: "tang",
    许: "xu", 邓: "deng", 韩: "han", 冯: "feng", 曹: "cao",
  };
  return name.split("").map((c) => map[c] || "x").join("");
}
