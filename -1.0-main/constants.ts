import { DivinationTopic, Hexagram } from "./types";

const GENERIC_LINES = [
  "初九：潜龙勿用。",
  "九二：见龙在田，利见大人。",
  "九三：君子终日乾乾，夕惕若厉，无咎。",
  "九四：或跃在渊，无咎。",
  "九五：飞龙在天，利见大人。",
  "上九：亢龙有悔。"
];

export const HEXAGRAMS: Hexagram[] = [
  {
    id: 1,
    name: "乾为天",
    pinyin: "Qián wéi Tiān",
    english: "The Creative",
    structure: [1, 1, 1, 1, 1, 1],
    tag: "上上卦",
    judgment: "乾：元，亨，利，贞。大哉乾元，万物资始，乃统天。云行雨施，品物流形。大明终始，六位时成，时乘六龙以御天。乾道变化，各正性命，保合太和，乃利贞。首出庶物，万国咸宁。",
    lines: [
      "初九：潜龙勿用。 (Hidden Dragon. Do not act.)",
      "九二：见龙在田，利见大人。 (Dragon appearing in the field. It furthers one to see the great man.)",
      "九三：君子终日乾乾，夕惕若厉，无咎。 (All day long the superior man is creatively active.)",
      "九四：或跃在渊，无咎。 (Wavering flight over the depths. No blame.)",
      "九五：飞龙在天，利见大人。 (Flying dragon in the heavens. It furthers one to see the great man.)",
      "上九：亢龙有悔。 (Arrogant dragon will have cause to repent.)"
    ],
    image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&q=80"
  },
  {
    id: 2,
    name: "坤为地",
    pinyin: "Kūn wéi Dì",
    english: "The Receptive",
    structure: [0, 0, 0, 0, 0, 0],
    tag: "上上卦",
    judgment: "坤：元，亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。至哉坤元，万物资生，乃顺承天。坤厚载物，德合无疆。含弘光大，品物咸亨。",
    lines: [
      "初六：履霜，坚冰至。",
      "六二：直方大，不习无不利。",
      "六三：含章可贞。或从王事，无成有终。",
      "六四：括囊，无咎无誉。",
      "六五：黄裳，元吉。",
      "上六：龙战于野，其血玄黄。"
    ],
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80"
  },
  {
    id: 3,
    name: "水雷屯",
    pinyin: "Shuǐ Léi Zhūn",
    english: "Difficulty at the Beginning",
    structure: [1, 0, 0, 0, 1, 0],
    tag: "下下卦",
    judgment: "屯：元，亨，利，贞。勿用有攸往，利建侯。",
    lines: GENERIC_LINES
  },
  {
    id: 4,
    name: "山水蒙",
    pinyin: "Shān Shuǐ Méng",
    english: "Youthful Folly",
    structure: [0, 1, 0, 0, 0, 1],
    tag: "中下卦",
    judgment: "蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。",
    lines: GENERIC_LINES
  },
  {
    id: 5,
    name: "水天需",
    pinyin: "Shuǐ Tiān Xū",
    english: "Waiting (Nourishment)",
    structure: [1, 1, 1, 0, 1, 0],
    tag: "中上卦",
    judgment: "需：有孚，光亨，贞吉。利涉大川。",
    lines: GENERIC_LINES
  },
  {
    id: 6,
    name: "天水讼",
    pinyin: "Tiān Shuǐ Sòng",
    english: "Conflict",
    structure: [0, 1, 0, 1, 1, 1],
    tag: "中下卦",
    judgment: "讼：有孚，窒惕，中吉。终凶。利见大人，不利涉大川。",
    lines: GENERIC_LINES
  },
  {
    id: 7,
    name: "地水师",
    pinyin: "Dì Shuǐ Shī",
    english: "The Army",
    structure: [0, 1, 0, 0, 0, 0],
    tag: "中上卦",
    judgment: "师：贞，丈人，吉无咎。",
    lines: GENERIC_LINES
  },
  {
    id: 8,
    name: "水地比",
    pinyin: "Shuǐ Dì Bǐ",
    english: "Holding Together",
    structure: [0, 0, 0, 0, 1, 0],
    tag: "上上卦",
    judgment: "比：吉。原筮，元永贞，无咎。不宁方来，后夫凶。",
    lines: GENERIC_LINES
  },
  {
    id: 9,
    name: "风天小畜",
    pinyin: "Fēng Tiān Xiǎo Chù",
    english: "The Taming Power of the Small",
    structure: [1, 1, 1, 0, 1, 1],
    tag: "下下卦",
    judgment: "小畜：亨。密云不雨，自我西郊。",
    lines: GENERIC_LINES
  },
  {
    id: 10,
    name: "天泽履",
    pinyin: "Tiān Zé Lǚ",
    english: "Treading (Conduct)",
    structure: [1, 1, 0, 1, 1, 1],
    tag: "中上卦",
    judgment: "履：履虎尾，不咥人，亨。",
    lines: GENERIC_LINES
  },
  {
    id: 11,
    name: "地天泰",
    pinyin: "Dì Tiān Tài",
    english: "Peace",
    structure: [1, 1, 1, 0, 0, 0],
    tag: "上上卦",
    judgment: "泰：小往大来，吉亨。",
    lines: GENERIC_LINES
  },
  {
    id: 12,
    name: "天地否",
    pinyin: "Tiān Dì Pǐ",
    english: "Standstill (Stagnation)",
    structure: [0, 0, 0, 1, 1, 1],
    tag: "下下卦",
    judgment: "否：否之匪人，不利君子贞。大往小来。",
    lines: GENERIC_LINES
  },
  {
    id: 13,
    name: "天火同人",
    pinyin: "Tiān Huǒ Tóng Rén",
    english: "Fellowship with Men",
    structure: [1, 0, 1, 1, 1, 1],
    tag: "中上卦",
    judgment: "同人：同人于野，亨。利涉大川，利君子贞。",
    lines: GENERIC_LINES
  },
  {
    id: 14,
    name: "火天大有",
    pinyin: "Huǒ Tiān Dà Yǒu",
    english: "Possession in Great Measure",
    structure: [1, 1, 1, 1, 0, 1],
    tag: "上上卦",
    judgment: "大有：元亨。",
    lines: GENERIC_LINES
  },
  {
    id: 15,
    name: "地山谦",
    pinyin: "Dì Shān Qiān",
    english: "Modesty",
    structure: [0, 0, 1, 0, 0, 0],
    tag: "中中卦",
    judgment: "谦：亨，君子有终。",
    lines: GENERIC_LINES
  },
  {
    id: 16,
    name: "雷地豫",
    pinyin: "Léi Dì Yù",
    english: "Enthusiasm",
    structure: [0, 0, 0, 1, 0, 0],
    tag: "中中卦",
    judgment: "豫：利建侯行师。",
    lines: GENERIC_LINES
  },
  {
    id: 17,
    name: "泽雷随",
    pinyin: "Zé Léi Suí",
    english: "Following",
    structure: [1, 0, 0, 1, 1, 0],
    tag: "中中卦",
    judgment: "随：元亨利贞，无咎。",
    lines: GENERIC_LINES
  },
  {
    id: 18,
    name: "山风蛊",
    pinyin: "Shān Fēng Gǔ",
    english: "Work on What Has Been Spoiled",
    structure: [0, 1, 1, 0, 0, 1],
    tag: "中下卦",
    judgment: "蛊：元亨，利涉大川。先甲三日，后甲三日。",
    lines: GENERIC_LINES
  },
  {
    id: 19,
    name: "地泽临",
    pinyin: "Dì Zé Lín",
    english: "Approach",
    structure: [1, 1, 0, 0, 0, 0],
    tag: "中上卦",
    judgment: "临：元，亨，利，贞。至于八月有凶。",
    lines: GENERIC_LINES
  },
  {
    id: 20,
    name: "风地观",
    pinyin: "Fēng Dì Guān",
    english: "Contemplation (View)",
    structure: [0, 0, 0, 0, 1, 1],
    tag: "中上卦",
    judgment: "观：盥而不荐，有孚颙若。",
    lines: GENERIC_LINES
  },
  {
    id: 21,
    name: "火雷噬嗑",
    pinyin: "Huǒ Léi Shì Kè",
    english: "Biting Through",
    structure: [1, 0, 0, 1, 0, 1],
    tag: "中下卦",
    judgment: "噬嗑：亨。利用狱。",
    lines: GENERIC_LINES
  },
  {
    id: 22,
    name: "山火贲",
    pinyin: "Shān Huǒ Bì",
    english: "Grace",
    structure: [1, 0, 1, 0, 0, 1],
    tag: "中上卦",
    judgment: "贲：亨。小利有攸往。",
    lines: GENERIC_LINES
  },
  {
    id: 23,
    name: "山地剥",
    pinyin: "Shān Dì Bō",
    english: "Splitting Apart",
    structure: [0, 0, 0, 0, 0, 1],
    tag: "中下卦",
    judgment: "剥：不利有攸往。",
    lines: GENERIC_LINES
  },
  {
    id: 24,
    name: "地雷复",
    pinyin: "Dì Léi Fù",
    english: "Return (The Turning Point)",
    structure: [1, 0, 0, 0, 0, 0],
    tag: "中中卦",
    judgment: "复：亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。",
    lines: GENERIC_LINES
  },
  {
    id: 25,
    name: "天雷无妄",
    pinyin: "Tiān Léi Wú Wàng",
    english: "Innocence (The Unexpected)",
    structure: [1, 0, 0, 1, 1, 1],
    tag: "下下卦",
    judgment: "无妄：元，亨，利，贞。其匪正有眚，不利有攸往。",
    lines: GENERIC_LINES
  },
  {
    id: 26,
    name: "山天大畜",
    pinyin: "Shān Tiān Dà Chù",
    english: "The Taming Power of the Great",
    structure: [1, 1, 1, 0, 0, 1],
    tag: "中上卦",
    judgment: "大畜：利贞，不家食吉，利涉大川。",
    lines: GENERIC_LINES
  },
  {
    id: 27,
    name: "山雷颐",
    pinyin: "Shān Léi Yí",
    english: "Corners of the Mouth",
    structure: [1, 0, 0, 0, 0, 1],
    tag: "上上卦",
    judgment: "颐：贞吉。观颐，自求口实。",
    lines: GENERIC_LINES
  },
  {
    id: 28,
    name: "泽风大过",
    pinyin: "Zé Fēng Dà Guò",
    english: "Preponderance of the Great",
    structure: [0, 1, 1, 1, 1, 0],
    tag: "中下卦",
    judgment: "大过：栋挠，利有攸往，亨。",
    lines: GENERIC_LINES
  },
  {
    id: 29,
    name: "坎为水",
    pinyin: "Kǎn wéi Shuǐ",
    english: "The Abysmal (Water)",
    structure: [0, 1, 0, 0, 1, 0],
    tag: "下下卦",
    judgment: "坎：习坎，有孚，维心亨，行有尚。",
    lines: GENERIC_LINES
  },
  {
    id: 30,
    name: "离为火",
    pinyin: "Lí wéi Huǒ",
    english: "The Clinging (Fire)",
    structure: [1, 0, 1, 1, 0, 1],
    tag: "中上卦",
    judgment: "离：利贞，亨。畜牝牛，吉。",
    lines: GENERIC_LINES
  },
  {
    id: 31,
    name: "泽山咸",
    pinyin: "Zé Shān Xián",
    english: "Influence (Wooing)",
    structure: [0, 0, 1, 1, 1, 0],
    tag: "中上卦",
    judgment: "咸：亨，利贞，取女吉。",
    lines: GENERIC_LINES
  },
  {
    id: 32,
    name: "雷风恒",
    pinyin: "Léi Fēng Héng",
    english: "Duration",
    structure: [0, 1, 1, 0, 0, 1],
    tag: "中下卦",
    judgment: "恒：亨，无咎，利贞，利有攸往。",
    lines: GENERIC_LINES
  },
  {
    id: 33,
    name: "天山遁",
    pinyin: "Tiān Shān Dùn",
    english: "Retreat",
    structure: [0, 0, 1, 1, 1, 1],
    tag: "下下卦",
    judgment: "遁：亨，小利贞。",
    lines: GENERIC_LINES
  },
  {
    id: 34,
    name: "雷天大壮",
    pinyin: "Léi Tiān Dà Zhuàng",
    english: "The Power of the Great",
    structure: [1, 1, 1, 1, 0, 0],
    tag: "中上卦",
    judgment: "大壮：利贞。",
    lines: GENERIC_LINES
  },
  {
    id: 35,
    name: "火地晋",
    pinyin: "Huǒ Dì Jìn",
    english: "Progress",
    structure: [0, 0, 0, 1, 0, 1],
    tag: "中上卦",
    judgment: "晋：康侯用锡马蕃庶，昼日三接。",
    lines: GENERIC_LINES
  },
  {
    id: 36,
    name: "地火明夷",
    pinyin: "Dì Huǒ Míng Yí",
    english: "Darkening of the Light",
    structure: [1, 0, 1, 0, 0, 0],
    tag: "中下卦",
    judgment: "明夷：利艰贞。",
    lines: GENERIC_LINES
  },
  {
    id: 37,
    name: "风火家人",
    pinyin: "Fēng Huǒ Jiā Rén",
    english: "The Family",
    structure: [1, 0, 1, 0, 1, 1],
    tag: "下下卦",
    judgment: "家人：利女贞。",
    lines: GENERIC_LINES
  },
  {
    id: 38,
    name: "火泽睽",
    pinyin: "Huǒ Zé Kuí",
    english: "Opposition",
    structure: [1, 1, 0, 1, 0, 1],
    tag: "下下卦",
    judgment: "睽：小事吉。",
    lines: GENERIC_LINES
  },
  {
    id: 39,
    name: "水山蹇",
    pinyin: "Shuǐ Shān Jiǎn",
    english: "Obstruction",
    structure: [0, 0, 1, 0, 1, 0],
    tag: "下下卦",
    judgment: "蹇：利西南，不利东北；利见大人，贞吉。",
    lines: GENERIC_LINES
  },
  {
    id: 40,
    name: "雷水解",
    pinyin: "Léi Shuǐ Xiè",
    english: "Deliverance",
    structure: [0, 1, 0, 1, 0, 0],
    tag: "中上卦",
    judgment: "解：利西南，无所往，其来复吉。有攸往，夙吉。",
    lines: GENERIC_LINES
  },
  {
    id: 41,
    name: "山泽损",
    pinyin: "Shān Zé Sǔn",
    english: "Decrease",
    structure: [1, 1, 0, 0, 0, 1],
    tag: "下下卦",
    judgment: "损：有孚，元吉，无咎，可贞，利有攸往。曷之用，二簋可用享。",
    lines: GENERIC_LINES
  },
  {
    id: 42,
    name: "风雷益",
    pinyin: "Fēng Léi Yì",
    english: "Increase",
    structure: [1, 0, 0, 1, 1, 0],
    tag: "上上卦",
    judgment: "益：利有攸往，利涉大川。",
    lines: GENERIC_LINES
  },
  {
    id: 43,
    name: "泽天夬",
    pinyin: "Zé Tiān Guài",
    english: "Break-through (Resoluteness)",
    structure: [1, 1, 1, 1, 1, 0],
    tag: "上上卦",
    judgment: "夬：扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往。",
    lines: GENERIC_LINES
  },
  {
    id: 44,
    name: "天风姤",
    pinyin: "Tiān Fēng Gòu",
    english: "Coming to Meet",
    structure: [0, 1, 1, 1, 1, 1],
    tag: "上上卦",
    judgment: "姤：女壮，勿用取女。",
    lines: GENERIC_LINES
  },
  {
    id: 45,
    name: "泽地萃",
    pinyin: "Zé Dì Cuì",
    english: "Gathering Together",
    structure: [0, 0, 0, 1, 1, 0],
    tag: "中上卦",
    judgment: "萃：亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。",
    lines: GENERIC_LINES
  },
  {
    id: 46,
    name: "地风升",
    pinyin: "Dì Fēng Shēng",
    english: "Pushing Upward",
    structure: [0, 1, 1, 0, 0, 0],
    tag: "上上卦",
    judgment: "升：元亨，用见大人，勿恤，南征吉。",
    lines: GENERIC_LINES
  },
  {
    id: 47,
    name: "泽水困",
    pinyin: "Zé Shuǐ Kùn",
    english: "Oppression (Exhaustion)",
    structure: [0, 1, 0, 1, 1, 0],
    tag: "中上卦",
    judgment: "困：亨，贞，大人吉，无咎，有言不信。",
    lines: GENERIC_LINES
  },
  {
    id: 48,
    name: "水风井",
    pinyin: "Shuǐ Fēng Jǐng",
    english: "The Well",
    structure: [0, 1, 1, 0, 1, 0],
    tag: "上上卦",
    judgment: "井：改邑不改井，无丧无得，往来井井。To draw water.",
    lines: GENERIC_LINES
  },
  {
    id: 49,
    name: "泽火革",
    pinyin: "Zé Huǒ Gé",
    english: "Revolution (Molting)",
    structure: [1, 0, 1, 1, 1, 0],
    tag: "上上卦",
    judgment: "革：已日乃孚，元亨利贞，悔亡。",
    lines: GENERIC_LINES
  },
  {
    id: 50,
    name: "火风鼎",
    pinyin: "Huǒ Fēng Dǐng",
    english: "The Cauldron",
    structure: [0, 1, 1, 1, 0, 1],
    tag: "中下卦",
    judgment: "鼎：元吉，亨。",
    lines: GENERIC_LINES
  },
  {
    id: 51,
    name: "震为雷",
    pinyin: "Zhèn wéi Léi",
    english: "The Arousing (Shock)",
    structure: [1, 0, 0, 1, 0, 0],
    tag: "中上卦",
    judgment: "震：亨。震来虩虩，笑言哑哑。震惊百里，不丧匕昶。",
    lines: GENERIC_LINES
  },
  {
    id: 52,
    name: "艮为山",
    pinyin: "Gèn wéi Shān",
    english: "Keeping Still, Mountain",
    structure: [0, 0, 1, 0, 0, 1],
    tag: "中下卦",
    judgment: "艮：艮其背，不获其身，行其庭，不见其人，无咎。",
    lines: GENERIC_LINES
  },
  {
    id: 53,
    name: "风山渐",
    pinyin: "Fēng Shān Jiàn",
    english: "Development (Gradual Progress)",
    structure: [0, 0, 1, 0, 1, 1],
    tag: "上上卦",
    judgment: "渐：女归吉，利贞。",
    lines: GENERIC_LINES
  },
  {
    id: 54,
    name: "雷泽归妹",
    pinyin: "Léi Zé Guī Mèi",
    english: "The Marrying Maiden",
    structure: [1, 1, 0, 1, 0, 0],
    tag: "下下卦",
    judgment: "归妹：征凶，无攸利。",
    lines: GENERIC_LINES
  },
  {
    id: 55,
    name: "雷火丰",
    pinyin: "Léi Huǒ Fēng",
    english: "Abundance",
    structure: [1, 0, 1, 1, 0, 0],
    tag: "上上卦",
    judgment: "丰：亨，王假之，勿忧，宜日中。",
    lines: GENERIC_LINES
  },
  {
    id: 56,
    name: "火山旅",
    pinyin: "Huǒ Shān Lǚ",
    english: "The Wanderer",
    structure: [0, 0, 1, 1, 0, 1],
    tag: "下下卦",
    judgment: "旅：小亨，旅贞吉。",
    lines: GENERIC_LINES
  },
  {
    id: 57,
    name: "巽为风",
    pinyin: "Xùn wéi Fēng",
    english: "The Gentle (The Penetrating)",
    structure: [0, 1, 1, 0, 1, 1],
    tag: "中上卦",
    judgment: "巽：小亨，利有攸往，利见大人。",
    lines: GENERIC_LINES
  },
  {
    id: 58,
    name: "兑为泽",
    pinyin: "Duì wéi Zé",
    english: "The Joyous, Lake",
    structure: [1, 1, 0, 1, 1, 0],
    tag: "上上卦",
    judgment: "兑：亨，利贞。",
    lines: GENERIC_LINES
  },
  {
    id: 59,
    name: "风水涣",
    pinyin: "Fēng Shuǐ Huàn",
    english: "Dispersion (Dissolution)",
    structure: [0, 1, 0, 0, 1, 1],
    tag: "下下卦",
    judgment: "涣：亨。王假有庙，利涉大川，利贞。",
    lines: GENERIC_LINES
  },
  {
    id: 60,
    name: "水泽节",
    pinyin: "Shuǐ Zé Jié",
    english: "Limitation",
    structure: [1, 1, 0, 0, 1, 0],
    tag: "上上卦",
    judgment: "节：亨。苦节，不可贞。",
    lines: GENERIC_LINES
  },
  {
    id: 61,
    name: "风泽中孚",
    pinyin: "Fēng Zé Zhōng Fú",
    english: "Inner Truth",
    structure: [1, 1, 0, 0, 1, 1],
    tag: "下下卦",
    judgment: "中孚：豚鱼，吉，利涉大川，利贞。",
    lines: GENERIC_LINES
  },
  {
    id: 62,
    name: "雷山小过",
    pinyin: "Léi Shān Xiǎo Guò",
    english: "Preponderance of the Small",
    structure: [0, 0, 1, 1, 0, 0],
    tag: "中上卦",
    judgment: "小过：亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上，宜下，大吉。",
    lines: GENERIC_LINES
  },
  {
    id: 63,
    name: "水火既济",
    pinyin: "Shuǐ Huǒ Jì Jì",
    english: "After Completion",
    structure: [1, 0, 1, 0, 1, 0],
    tag: "上上卦",
    judgment: "既济：亨，小利贞，初吉终乱。",
    lines: GENERIC_LINES
  },
  {
    id: 64,
    name: "火水未济",
    pinyin: "Huǒ Shuǐ Wèi Jì",
    english: "Before Completion",
    structure: [0, 1, 0, 1, 0, 1],
    tag: "中下卦",
    judgment: "未济：亨，小狐汔济，濡其尾，无攸利。",
    lines: GENERIC_LINES
  }
];

export const DIVINATION_TOPICS = [
  {
    id: DivinationTopic.CAREER,
    label: "事业",
    enLabel: "Career",
    icon: "work"
  },
  {
    id: DivinationTopic.HEALTH,
    label: "健康",
    enLabel: "Health",
    icon: "spa"
  },
  {
    id: DivinationTopic.WEALTH,
    label: "财运",
    enLabel: "Wealth",
    icon: "account_balance"
  },
  {
    id: DivinationTopic.RELATIONSHIPS,
    label: "姻缘",
    enLabel: "Relationships",
    icon: "favorite"
  }
];

export const BACKGROUND_TEXTURE = "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?w=800&q=80";