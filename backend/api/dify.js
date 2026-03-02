const HEXAGRAMS = [
  { id: 1, name: "乾", pinyin: "qián", english: "The Creative", judgment: "元亨利贞", tag: "上吉" },
  { id: 2, name: "坤", pinyin: "kūn", english: "The Receptive", judgment: "元亨利牝马之贞", tag: "吉" },
  { id: 3, name: "屯", pinyin: "zhūn", english: "Difficulty at the Beginning", judgment: "元亨利贞，勿用有攸往", tag: "平" },
  { id: 4, name: "蒙", pinyin: "méng", english: "Youthful Folly", judgment: "亨。匪我求童蒙，童蒙求我", tag: "平" },
  { id: 5, name: "需", pinyin: "xū", english: "Waiting", judgment: "有孚，光亨，贞吉，利涉大川", tag: "吉" },
  { id: 6, name: "讼", pinyin: "sòng", english: "Conflict", judgment: "有孚窒惕，中吉，终凶", tag: "凶" },
  { id: 7, name: "师", pinyin: "shī", english: "The Army", judgment: "贞，丈人吉，无咎", tag: "吉" },
  { id: 8, name: "比", pinyin: "bǐ", english: "Holding Together", judgment: "吉。原筮元永贞，无咎", tag: "吉" },
  { id: 9, name: "小畜", pinyin: "xiǎo xù", english: "The Taming Power of the Small", judgment: "亨。密云不雨，自我西郊", tag: "平" },
  { id: 10, name: "履", pinyin: "lǚ", english: "Treading", judgment: "履虎尾，不咥人，亨", tag: "吉" },
  { id: 11, name: "泰", pinyin: "tài", english: "Peace", judgment: "小往大来，吉亨", tag: "上吉" },
  { id: 12, name: "否", pinyin: "pǐ", english: "Stagnation", judgment: "否之匪人，不利君子贞，大往小来", tag: "凶" },
  { id: 13, name: "同人", pinyin: "tóng rén", english: "Fellowship with Men", judgment: "同人于野，亨。利涉大川，利君子贞", tag: "吉" },
  { id: 14, name: "大有", pinyin: "dà yǒu", english: "Great Possession", judgment: "元亨", tag: "上吉" },
  { id: 15, name: "谦", pinyin: "qiān", english: "Modesty", judgment: "亨，君子有终", tag: "吉" },
  { id: 16, name: "豫", pinyin: "yù", english: "Enthusiasm", judgment: "利建侯行师", tag: "吉" },
  { id: 17, name: "随", pinyin: "suí", english: "Following", judgment: "元亨利贞，无咎", tag: "吉" },
  { id: 18, name: "蛊", pinyin: "gǔ", english: "Work on What has been Spoiled", judgment: "元亨，利涉大川。先甲三日，后甲三日", tag: "平" },
  { id: 19, name: "临", pinyin: "lín", english: "Approach", judgment: "元亨利贞，至于八月有凶", tag: "平" },
  { id: 20, name: "观", pinyin: "guān", english: "Contemplation", judgment: "盥而不荐，有孚颙若", tag: "平" },
  { id: 21, name: "噬嗑", pinyin: "shì kè", english: "Biting Through", judgment: "亨，利用狱", tag: "平" },
  { id: 22, name: "贲", pinyin: "bì", english: "Grace", judgment: "亨，小利有攸往", tag: "吉" },
  { id: 23, name: "剥", pinyin: "bō", english: "Splitting Apart", judgment: "不利有攸往", tag: "凶" },
  { id: 24, name: "复", pinyin: "fù", english: "Return", judgment: "亨。出入无疾，朋来无咎", tag: "吉" },
  { id: 25, name: "无妄", pinyin: "wú wàng", english: "Unexpected", judgment: "元亨利贞。其匪正有眚，不利有攸往", tag: "吉" },
  { id: 26, name: "大畜", pinyin: "dà xù", english: "Great Accumulation", judgment: "利贞，不家食吉，利涉大川", tag: "吉" },
  { id: 27, name: "颐", pinyin: "yí", english: "Providing Nourishment", judgment: "贞吉。观颐，自求口实", tag: "平" },
  { id: 28, name: "大过", pinyin: "dà guò", english: "Great Excess", judgment: "栋桡，利有攸往，亨", tag: "平" },
  { id: 29, name: "坎", pinyin: "kǎn", english: "The Abysmal", judgment: "有孚维心，亨，行有尚", tag: "平" },
  { id: 30, name: "离", pinyin: "lí", english: "The Clinging", judgment: "利贞，亨。畜牝牛吉", tag: "吉" },
  { id: 31, name: "咸", pinyin: "xián", english: "Influence", judgment: "亨，利贞，取女吉", tag: "吉" },
  { id: 32, name: "恒", pinyin: "héng", english: "Perseverance", judgment: "亨，无咎，利贞，利有攸往", tag: "吉" },
  { id: 33, name: "遁", pinyin: "dùn", english: "Retreat", judgment: "亨，小利贞", tag: "平" },
  { id: 34, name: "大壮", pinyin: "dà zhuàng", english: "Power in the Great", judgment: "利贞", tag: "吉" },
  { id: 35, name: "晋", pinyin: "jìn", english: "Progress", judgment: "康侯用锡马蕃庶，昼日三接", tag: "吉" },
  { id: 36, name: "明夷", pinyin: "míng yí", english: "Darkness", judgment: "利艰贞", tag: "凶" },
  { id: 37, name: "家人", pinyin: "jiā rén", english: "The Family", judgment: "利女贞", tag: "吉" },
  { id: 38, name: "睽", pinyin: "kuí", english: "Opposition", judgment: "小事吉", tag: "平" },
  { id: 39, name: "蹇", pinyin: "jiǎn", english: "Obstruction", judgment: "利西南，不利东北。利见大人，贞吉", tag: "平" },
  { id: 40, name: "解", pinyin: "jiě", english: "Deliverance", judgment: "利西南。无所往，其来复吉。有攸往，夙吉", tag: "吉" },
  { id: 41, name: "损", pinyin: "sǔn", english: "Decrease", judgment: "有孚，元吉，无咎，可贞，利有攸往", tag: "平" },
  { id: 42, name: "益", pinyin: "yì", english: "Increase", judgment: "利有攸往，利涉大川", tag: "吉" },
  { id: 43, name: "夬", pinyin: "guài", english: "Break-through", judgment: "扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往", tag: "平" },
  { id: 44, name: "姤", pinyin: "gòu", english: "Meeting", judgment: "女壮，勿用取女", tag: "平" },
  { id: 45, name: "萃", pinyin: "cuì", english: "Gathering Together", judgment: "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往", tag: "吉" },
  { id: 46, name: "升", pinyin: "shēng", english: "Ascending", judgment: "元亨。用见大人，勿恤。南征吉", tag: "吉" },
  { id: 47, name: "困", pinyin: "kùn", english: "Oppression", judgment: "亨，贞，大人吉，无咎。有言不信", tag: "平" },
  { id: 48, name: "井", pinyin: "jǐng", english: "The Well", judgment: "改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶", tag: "平" },
  { id: 49, name: "革", pinyin: "gé", english: "Revolution", judgment: "巳日乃孚，元亨利贞，悔亡", tag: "吉" },
  { id: 50, name: "鼎", pinyin: "dǐng", english: "The Cauldron", judgment: "元吉，亨", tag: "吉" },
  { id: 51, name: "震", pinyin: "zhèn", english: "The Arousing", judgment: "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯", tag: "平" },
  { id: 52, name: "艮", pinyin: "gèn", english: "Keeping Still", judgment: "艮其背，不获其身，行其庭，不见其人，无咎", tag: "平" },
  { id: 53, name: "渐", pinyin: "jiàn", english: "Development", judgment: "女归吉，利贞", tag: "吉" },
  { id: 54, name: "归妹", pinyin: "guī mèi", english: "The Marrying Maiden", judgment: "征凶，无攸利", tag: "凶" },
  { id: 55, name: "丰", pinyin: "fēng", english: "Abundance", judgment: "亨，王假之，勿忧，宜日中", tag: "吉" },
  { id: 56, name: "旅", pinyin: "lǚ", english: "The Wanderer", judgment: "小亨，旅贞吉", tag: "平" },
  { id: 57, name: "巽", pinyin: "xùn", english: "The Gentle", judgment: "小亨，利有攸往，利见大人", tag: "平" },
  { id: 58, name: "兑", pinyin: "duì", english: "The Joyous", judgment: "亨，利贞", tag: "吉" },
  { id: 59, name: "涣", pinyin: "huàn", english: "Dispersion", judgment: "亨，王假有庙，利涉大川，利贞", tag: "吉" },
  { id: 60, name: "节", pinyin: "jié", english: "Containment", judgment: "亨，苦节不可贞", tag: "平" },
  { id: 61, name: "中孚", pinyin: "zhōng fú", english: "Inner Truth", judgment: "豚鱼吉，利涉大川，利贞", tag: "吉" },
  { id: 62, name: "小过", pinyin: "xiǎo guò", english: "Small Excess", judgment: "亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉", tag: "平" },
  { id: 63, name: "既济", pinyin: "jì jì", english: "After Completion", judgment: "亨，小利贞，初吉终乱", tag: "平" },
  { id: 64, name: "未济", pinyin: "wèi jì", english: "Before Completion", judgment: "亨，小狐汔济，濡其尾，无攸利", tag: "平" }
];

const TOPIC_MAP = {
  'career': '事业',
  'health': '健康',
  'wealth': '财运',
  'relationships': '姻缘'
};

const QUOTES = [
  "天行健，君子以自强不息。",
  "地势坤，君子以厚德载物。",
  "居上位而不骄，在下位而不忧。",
  "穷则变，变则通，通则久。",
  "君子藏器于身，待时而动。",
  "知几其神乎！君子上交不谄，下交不渎。",
  "满招损，谦受益。",
  "日中则昃，月盈则食。",
  "尺蠖之屈，以求信也；龙蛇之蛰，以存身也。",
  "善不积不足以成名，恶不积不足以灭身。",
  "见善则迁，有过则改。",
  "君子敬以直内，义以方外。",
  "二人同心，其利断金。",
  "无平不陂，无往不复。",
  "君子以遏恶扬善，顺天休命。",
  "君子以虚受人。",
  "君子以独立不惧，遁世无闷。",
  "君子以恐惧修省。",
  "君子以顺德，积小以高大。",
  "时止则止，时行则行，动静不失其时，其道光明。"
];

const CONCEPTS = [
  { title: "变易与不易", desc: "万物皆变，唯变不变。此卦提示你在变动中寻找恒定的规律。" },
  { title: "阴阳消长", desc: "盛极必衰，否极泰来。理解当前所处的阴阳阶段至关重要。" },
  { title: "时位之义", desc: "得时者昌，失时者亡。行动的快慢需与时机契合。" },
  { title: "中正之道", desc: "过犹不及，不偏不倚。保持内心的平衡是解决问题的关键。" },
  { title: "积善成德", desc: "勿以善小而不为，勿以恶小而为之。积小善而成大德。" },
  { title: "诚信为本", desc: "人无信不立，业无信不兴。诚信是一切事业的基础。" },
  { title: "顺势而为", desc: "顺天者昌，逆天者亡。顺应自然规律才能事半功倍。" },
  { title: "知足常乐", desc: "知足者富，强行者有志。懂得满足才能获得真正的快乐。" }
];

const KEYWORDS = {
  'career': ['机遇', '挑战', '成长', '领导力', '团队', '决策', '创新'],
  'health': ['平衡', '调理', '修养', '心态', '锻炼', '饮食', '作息'],
  'wealth': ['积累', '投资', '风险', '机遇', '节俭', '慷慨', '智慧'],
  'relationships': ['沟通', '理解', '信任', '包容', '珍惜', '缘分', '成长']
};

function generateResponse(hex, topic, query) {
  const topicName = TOPIC_MAP[topic] || topic;
  const topicKeywords = KEYWORDS[topic] || KEYWORDS['career'];
  
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  
  const keywords = [];
  while (keywords.length < 4) {
    const keyword = topicKeywords[Math.floor(Math.random() * topicKeywords.length)];
    if (!keywords.includes(keyword)) {
      keywords.push(keyword);
    }
  }
  
  const concept = CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
  
  const detailed = `卦象${hex.name}${hex.tag === '上吉' ? '大吉大利' : hex.tag === '吉' ? '吉祥如意' : hex.tag === '平' ? '平稳发展' : '需谨慎应对'}，${topicName}方面${query ? `针对"${query}"` : ''}，建议你${Math.random() > 0.5 ? '积极进取' : '稳扎稳打'}，${Math.random() > 0.5 ? '把握机遇' : '防范风险'}，${Math.random() > 0.5 ? '与人为善' : '自我提升'}，${Math.random() > 0.5 ? '顺应时势' : '坚持信念'}。`;
  
  return { quote, keywords, concept, detailed };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    res.status(200).json({ status: 'ok', message: '后端服务运行正常' });
    return;
  }
  
  if (req.method === 'POST') {
    const { query, hexagram, topic } = req.body;
    
    if (!hexagram || !topic) {
      res.status(400).json({ error: '缺少必要参数' });
      return;
    }

    const hex = HEXAGRAMS.find(h => h.id === hexagram.id);
    if (!hex) {
      res.status(400).json({ error: '卦象不存在' });
      return;
    }

    const response = generateResponse(hex, topic, query);
    res.status(200).json(response);
    return;
  }
  
  res.status(404).json({ error: '接口不存在' });
}
