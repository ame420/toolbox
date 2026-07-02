/** 中文古典文本数据与生成 */

export const CLASSICAL_TYPES = ["analects", "tang"] as const;
export type ClassicalType = (typeof CLASSICAL_TYPES)[number];

export interface ClassicalTextType {
  id: ClassicalType;
  titleZh: string;
  titleEn: string;
}

export const CLASSICAL_TEXT_TYPES: ClassicalTextType[] = [
  { id: "analects", titleZh: "论语", titleEn: "Analects" },
  { id: "tang", titleZh: "唐诗", titleEn: "Tang Poetry" },
];

const ANALECTS_QUOTES = [
  "学而时习之，不亦说乎？有朋自远方来，不亦乐乎？",
  "吾日三省吾身：为人谋而不忠乎？与朋友交而不信乎？传不习乎？",
  "温故而知新，可以为师矣。",
  "学而不思则罔，思而不学则殆。",
  "知之为知之，不知为不知，是知也。",
  "三人行，必有我师焉。择其善者而从之，其不善者而改之。",
  "己所不欲，勿施于人。",
  "君子喻于义，小人喻于利。",
  "见贤思齐焉，见不贤而内自省也。",
  "士不可以不弘毅，任重而道远。",
  "学如不及，犹恐失之。",
  "敏而好学，不耻下问。",
  "知之者不如好之者，好之者不如乐之者。",
  "不义而富且贵，于我如浮云。",
  "君子坦荡荡，小人长戚戚。",
  "三军可夺帅也，匹夫不可夺志也。",
  "岁寒，然后知松柏之后凋也。",
  "欲速则不达，见小利则大事不成。",
  "人无远虑，必有近忧。",
  "工欲善其事，必先利其器。",
];

const TANG_POEMS = [
  "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
  "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
  "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
  "锄禾日当午，汗滴禾下土。谁知盘中餐，粒粒皆辛苦。",
  "千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。",
  "空山不见人，但闻人语响。返景入深林，复照青苔上。",
  "红豆生南国，春来发几枝。愿君多采撷，此物最相思。",
  "松下问童子，言师采药去。只在此山中，云深不知处。",
  "危楼高百尺，手可摘星辰。不敢高声语，恐惊天上人。",
  "葡萄美酒夜光杯，欲饮琵琶马上催。醉卧沙场君莫笑，古来征战几人回。",
  "秦时明月汉时关，万里长征人未还。但使龙城飞将在，不教胡马度阴山。",
  "朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。",
  "故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。",
  "好雨知时节，当春乃发生。随风潜入夜，润物细无声。",
  "两个黄鹂鸣翠柳，一行白鹭上青天。窗含西岭千秋雪，门泊东吴万里船。",
];

export function generateClassicalText(type: ClassicalType, count: number): string {
  const pool = type === "analects" ? ANALECTS_QUOTES : TANG_POEMS;
  const result: string[] = [];
  for (let i = 0; i < count; i += 1) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return result.join("\n\n");
}
