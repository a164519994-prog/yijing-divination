import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { Icon } from '../components/Icon';
import { DIVINATION_TOPICS, HEXAGRAMS, BACKGROUND_TEXTURE } from '../constants';
import { DivinationTopic, Hexagram, DivinationContext, DivinationRecord } from '../types';

// ==========================================
// API 调用封装 (Dify Backend Proxy)
// ==========================================

async function callDifyProxy(hex: Hexagram, topic: string, query: string): Promise<AIDeepContent | null> {
  try {
    console.log(`[AI] Calling Dify Proxy...`);

    const response = await fetch('https://yijing-divination-omega.vercel.app/api/dify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        hexagram: hex,
        topic: topic
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || `Server error: ${response.status}`);
    }

    const data = await response.json();
    
    // Basic validation of the returned structure
    if (data.quote && data.concept && data.detailed) {
      return data;
    } else {
      throw new Error("Invalid JSON structure received from AI");
    }

  } catch (error) {
    console.error("[AI] Dify Proxy Call Failed:", error);
    return null;
  }
}

type ViewState = 'input' | 'context_input' | 'casting' | 'result' | 'analyzing' | 'interpretation' | 'deep_analyzing' | 'deep_interpretation' | 'history';

interface AIAdvice {
  title: string;
  body: string;
  points: string[];
}

interface AIDeepContent {
  quote: string;
  keywords: string[];
  concept: { title: string; desc: string };
  detailed: string;
}

export const Divination: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('input');
  const [selectedTopic, setSelectedTopic] = useState<DivinationTopic>(DivinationTopic.CAREER);
  const [resultHexagram, setResultHexagram] = useState<Hexagram | null>(null);
  const [history, setHistory] = useState<DivinationRecord[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  // State for the current divination session
  const [userQuery, setUserQuery] = useState('');
  const [userContext, setUserContext] = useState<DivinationContext>(DivinationContext.STABLE);
  const [passphrase, setPassphrase] = useState('');

  // AI Content State
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null);
  const [aiDeepContent, setAiDeepContent] = useState<AIDeepContent | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('divination_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('divination_history', JSON.stringify(history));
  }, [history]);

  const handleDivinationStart = () => {
    setViewState('context_input');
  };

  const handleRealStart = () => {
    setViewState('casting');
    // Clear previous AI results
    setAiAdvice(null);
    setAiDeepContent(null);
    
    setTimeout(() => {
      const randomHex = HEXAGRAMS[Math.floor(Math.random() * HEXAGRAMS.length)];
      setResultHexagram(randomHex);
      setViewState('result');
    }, 3500);
  };

  const handleAnalyzeStart = async () => {
    setViewState('analyzing');
    
    // 使用纯本地逻辑生成“指点迷津”
    const fallbackAdvice = getModernAdvice(resultHexagram, userContext, selectedTopic);
    setAiAdvice(fallbackAdvice);

    // Ensure at least some animation time passes
    setTimeout(() => {
      // Record to history once we reach interpretation
      if (resultHexagram) {
        const newRecord: DivinationRecord = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          topicId: selectedTopic,
          query: userQuery,
          context: userContext,
          hexagramId: resultHexagram.id
        };
        setHistory(prev => [newRecord, ...prev]);
      }
      setPassphrase('');
      setViewState('interpretation');
    }, 2500);
  };

  // 深度解卦触发逻辑 (Refined Async Logic)
  const handleDeepAnalyzeStart = async () => {
    setViewState('deep_analyzing');
    
    // 1. 准备本地知识库内容作为兜底，以防 API 失败
    const fallbackDeep = resultHexagram ? getDeepPhilosophy(resultHexagram, selectedTopic) : null;
    let aiResult: AIDeepContent | null = null;

    try {
      if (!resultHexagram) throw new Error("No hexagram");
      
      // 2. 并行执行：API 调用 + 最小动画时间
      // 这样做的目的是：如果 API 很快（0.5s），我们至少展示 3s 动画让用户有仪式感；
      // 如果 API 很慢（5s），用户会等待直到 API 完成，保证拿到的是真数据。
      const minAnimationTime = 3000;
      const animationPromise = new Promise(resolve => setTimeout(resolve, minAnimationTime));
      
      // CALL THE NEW PROXY
      const apiPromise = callDifyProxy(resultHexagram, selectedTopic, userQuery);

      // 等待两者都完成
      const [_, result] = await Promise.all([animationPromise, apiPromise]);
      aiResult = result;

    } catch (error) {
      console.error("Analysis Error, utilizing local wisdom:", error);
    }

    // 3. 决定最终展示内容：优先 AI，失败则回退到本地算法
    setAiDeepContent(aiResult || fallbackDeep);
    setViewState('deep_interpretation');
  };

  const handleReset = () => {
    setViewState('input');
    setResultHexagram(null);
    setUserQuery('');
    setUserContext(DivinationContext.STABLE);
    setPassphrase('');
    setAiAdvice(null);
    setAiDeepContent(null);
  };

  const loadHistoryItem = (record: DivinationRecord) => {
    const hex = HEXAGRAMS.find(h => h.id === record.hexagramId);
    if (hex) {
      setSelectedTopic(record.topicId);
      setUserQuery(record.query);
      setUserContext(record.context);
      setResultHexagram(hex);
      setPassphrase('');
      setAiAdvice(null);
      setAiDeepContent(null);
      setViewState('interpretation');
    }
  };

  // Helper to calculate prediction probability based on hexagram and context
  const getPredictionScore = (hex: Hexagram, ctx: DivinationContext) => {
    // Deterministic base score from hexagram ID
    let score = 65 + (hex.id * 17 % 25); // Range ~65-90 base
    
    // Context modifiers
    if (ctx === DivinationContext.PROSPERITY) score += 5; // Easier in prosperity
    if (ctx === DivinationContext.ADVERSITY) score -= 10; // Harder in adversity
    if (ctx === DivinationContext.STABLE) score -= 2;

    // Hexagram tag modifiers (simple heuristics based on tag string)
    if (hex.tag?.includes('上')) score += 8;
    if (hex.tag?.includes('吉')) score += 5;
    if (hex.tag?.includes('下')) score -= 12;
    if (hex.tag?.includes('凶')) score -= 10;

    return Math.min(98, Math.max(15, score));
  };

  /**
   * Generates tailored advice based on the specific Topic (Career, Health, etc.)
   * Used as FALLBACK if AI fails or for history viewing
   */
  const getModernAdvice = (hex: Hexagram | null, ctx: DivinationContext, topic: DivinationTopic): AIAdvice => {
    if (!hex) return { title: "", body: "", points: [] };
    
    let tone = "";
    let adviceBody = "";
    let points: string[] = [];
    
    // Determine content based on Topic first, then Context
    switch (topic) {
        case DivinationTopic.CAREER: // 事业
            if (ctx === DivinationContext.PROSPERITY) {
                tone = "鹏程万里，勿忘初心";
                adviceBody = `卦象【${hex.name}】显示你的事业运势正处于上升期。此卦如日中天，预示着晋升或拓展的良机。但切记“满招损”，在顺境中更要警惕骄傲自满，需着眼于建立长期的护城河。`;
                points = ["把握当下机遇，大胆推行新计划。", "注意团队协作，避免独断专行。", "居安思危，为可能的市场变动做准备。"];
            } else if (ctx === DivinationContext.ADVERSITY) {
                tone = "潜龙勿用，韬光养晦";
                adviceBody = `卦象【${hex.name}】提示当前职场环境阻力较大。此时强行突破如同逆水行舟，不如暂时收敛锋芒，专注于提升核心技能。每一次低谷都是为了更高的跃升做积累。`;
                points = ["暂缓跳槽或重大投资决策。", "反思过往项目中的不足，修补漏洞。", "寻找导师或前辈指点，耐心等待时机。"];
            } else {
                tone = "步步为营，持之以恒";
                adviceBody = `卦象【${hex.name}】显示事业处于平稳发展阶段。虽无惊天动地的变化，但这正是积累资历与人脉的最佳时期。按部就班，不急不躁，量变终将引起质变。`;
                points = ["制定详细的季度目标，稳扎稳打。", "维护好现有的人际关系网络。", "在日常工作中寻找优化的空间。"];
            }
            break;

        case DivinationTopic.HEALTH: // 健康
            if (ctx === DivinationContext.PROSPERITY) {
                tone = "形神兼备，顺应四时";
                adviceBody = `卦象【${hex.name}】表明你当前气血充盈，精力旺盛。这得益于之前的良好习惯，但不可因此过度透支。此卦提示应顺应季节变化，保持这种动态的平衡。`;
                points = ["适度增加户外运动，亲近自然。", "保持规律作息，切勿熬夜消耗阳气。", "注意饮食清淡，避免暴饮暴食。"];
            } else if (ctx === DivinationContext.ADVERSITY) {
                tone = "调和阴阳，去欲存诚";
                adviceBody = `卦象【${hex.name}】提示身体发出了预警信号。或许是长期的压力导致了身心的失衡。此时首要任务是“减法”，减少不必要的思虑与劳作，让身体自我修复。`;
                points = ["立即调整作息，保证充足睡眠。", "尝试冥想或静坐，缓解精神焦虑。", "就医检查，防微杜渐，不可讳疾忌医。"];
            } else {
                tone = "恬淡虚无，真气从之";
                adviceBody = `卦象【${hex.name}】显示健康状况平稳。这是一个保养的良机，建议通过温和的方式（如太极、瑜伽）来固本培元，预防未来的隐患。`;
                points = ["关注身体微小的变化，定期体检。", "保持情绪平和，少动肝火。", "培养一项长期的养生爱好。"];
            }
            break;

        case DivinationTopic.WEALTH: // 财运
            if (ctx === DivinationContext.PROSPERITY) {
                tone = "厚德载物，惠及他人";
                adviceBody = `卦象【${hex.name}】预示财源广进。你的投资或业务将迎来收获期。但易经讲究“舍得”，在获利的同时，适当回馈社会或与人分享，能让财运更加长久。`;
                points = ["适当扩大投资规模，但做足风控。", "与合作伙伴分享利益，巩固关系。", "考虑长线资产配置，而非短线投机。"];
            } else if (ctx === DivinationContext.ADVERSITY) {
                tone = "开源节流，待时而动";
                adviceBody = `卦象【${hex.name}】显示财运暂遇困顿。可能是市场环境不佳或个人决策失误。此时应以“守”为主，避免高风险操作，现金流的安全是第一位的。`;
                points = ["严格控制非必要支出，储备现金。", "避免借贷或高杠杆投资。", "学习理财知识，提升认知，等待周期反转。"];
            } else {
                tone = "精打细算，积玉堆金";
                adviceBody = `卦象【${hex.name}】显示财运平稳，无大起大落。这是积累财富的阶段，不要因为收益平平而焦虑。通过复利思维，小钱也能汇聚成江海。`;
                points = ["坚持定投策略，分散风险。", "记录开支，优化消费结构。", "寻找副业或提升技能以增加收入来源。"];
            }
            break;

        case DivinationTopic.RELATIONSHIPS: // 姻缘
            if (ctx === DivinationContext.PROSPERITY) {
                tone = "心有灵犀，佳偶天成";
                adviceBody = `卦象【${hex.name}】象征着美好的连接。无论是单身寻找伴侣，还是已有的关系，都处于和谐共鸣的状态。真诚的表达会让感情迅速升温。`;
                points = ["勇敢表达爱意，切勿迟疑。", "安排浪漫的共同活动，增进了解。", "若是单身，多参加社交聚会，良缘将至。"];
            } else if (ctx === DivinationContext.ADVERSITY) {
                tone = "反求诸己，退步海阔";
                adviceBody = `卦象【${hex.name}】提示关系中存在隔阂或冲突。此时强求对方改变只会适得其反。不如向内观照，反思自己的沟通方式，退一步往往能看到问题的本质。`;
                points = ["暂停争执，给彼此冷静的空间。", "换位思考，尝试理解对方的苦衷。", "若缘分已尽，学会放手也是一种慈悲。"];
            } else {
                tone = "细水长流，相敬如宾";
                adviceBody = `卦象【${hex.name}】显示感情生活平淡而真实。不要追求轰轰烈烈的戏剧感，平淡中的相守才是最长情的告白。在琐碎中发现温暖，是此卦的智慧。`;
                points = ["在日常生活中增加仪式感。", "多倾听对方的心声，少做评判。", "共同规划未来，寻找共同的目标。"];
            }
            break;
    }

    return {
        title: tone,
        body: adviceBody,
        points: points
    };
  };

  // Helper function to generate deep philosophical insights based on the hexagram and topic
  // Used as FALLBACK if AI fails
  const getDeepPhilosophy = (hex: Hexagram, topic: DivinationTopic): AIDeepContent => {
    const quotes = [
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
    
    // Determine Topic-Specific Keywords and Concepts
    let keywords: string[] = [];
    let domainMetaphor = "";

    switch (topic) {
        case DivinationTopic.CAREER:
            keywords = ["决断", "时机", "布局", "领导力"];
            domainMetaphor = "功业如登山，";
            break;
        case DivinationTopic.HEALTH:
            keywords = ["平衡", "节律", "疏通", "调养"];
            domainMetaphor = "身心如种树，";
            break;
        case DivinationTopic.WEALTH:
            keywords = ["风险", "积累", "流动", "舍得"];
            domainMetaphor = "财运如流水，";
            break;
        case DivinationTopic.RELATIONSHIPS:
            keywords = ["信任", "沟通", "换位", "缘分"];
            domainMetaphor = "情感如抚琴，";
            break;
    }
    
    const concepts = [
       { title: "变易与不易", desc: "万物皆变，唯变不变。此卦提示你在变动中寻找恒定的规律。" },
       { title: "阴阳消长", desc: "盛极必衰，否极泰来。理解当前所处的阴阳阶段至关重要。" },
       { title: "时位之义", desc: "得时者昌，失时者亡。行动的快慢需与时机契合。" },
       { title: "中正之道", desc: "过犹不及，不偏不倚。保持内心的平衡是解决问题的关键。" }
    ];

    // Random quote selection for diversity
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    // Deterministic concept based on hexagram ID
    const concept = concepts[hex.id % concepts.length];
    
    return {
       quote,
       concept,
       keywords,
       detailed: `从深层哲学视角来看，${hex.name}对于${topic === DivinationTopic.CAREER ? '事业' : topic === DivinationTopic.HEALTH ? '身心' : topic === DivinationTopic.WEALTH ? '财富' : '情感'}而言，不仅仅是吉凶的预示，更是一种状态的隐喻。${domainMetaphor} ${hex.judgment.substring(0, 10)}... 这种力量${hex.structure[0] === 1 ? '刚健有力，主导向外扩张' : '柔顺包容，主导向内转化'}。面对${userQuery ? `“${userQuery}”` : '心中的疑惑'}，真正的智慧在于${hex.id % 2 !== 0 ? '看清大势，顺水推舟' : '坚守本心，以静制动'}。`
    };
  };

  // Memoized values that prefer AI content if available, otherwise fall back to algorithmic content
  const advice = useMemo(() => {
     if (aiAdvice) return aiAdvice;
     return getModernAdvice(resultHexagram, userContext, selectedTopic);
  }, [resultHexagram, userContext, selectedTopic, aiAdvice]);
  
  const deepContent = useMemo(() => {
    if (aiDeepContent) return aiDeepContent;
    return resultHexagram ? getDeepPhilosophy(resultHexagram, selectedTopic) : null;
  }, [resultHexagram, selectedTopic, aiDeepContent]);

  const predictionScore = useMemo(() => {
     if (!resultHexagram) return 0;
     return getPredictionScore(resultHexagram, userContext);
  }, [resultHexagram, userContext]);

  // Helper to get back button behavior
  const handleBack = () => {
    if (viewState === 'history') return setViewState('input');
    if (viewState === 'interpretation') return setViewState('result');
    if (viewState === 'deep_interpretation') return setViewState('interpretation');
    return handleReset();
  };

  return (
    <Layout>
      {/* Header */}
      <header className="flex-none relative z-20 flex items-center justify-between px-6 pt-8 pb-2">
        {['result', 'interpretation', 'history', 'deep_interpretation'].includes(viewState) ? (
          <button 
            onClick={handleBack}
            className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-stone-500"
          >
            <Icon name="arrow_back" className="text-[20px]" />
          </button>
        ) : viewState === 'context_input' ? (
           <button 
            onClick={() => setViewState('input')}
            className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-stone-500"
          >
            <Icon name="arrow_back" className="text-[20px]" />
          </button>
        ) : (
          <button 
            onClick={() => setViewState('history')}
            className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-stone-400 dark:text-stone-500"
          >
            <Icon name="history" className="text-[20px]" />
          </button>
        )}
        
        {/* Dynamic Title and Disclaimer */}
        <div className={`transition-all duration-700 flex flex-col items-center gap-0.5 ${['casting', 'analyzing', 'deep_analyzing'].includes(viewState) ? 'opacity-0 translate-y-2' : 'opacity-100'}`}>
           {!['casting', 'analyzing', 'deep_analyzing'].includes(viewState) && (
              <>
                <span className="text-xs font-bold tracking-[0.3em] text-ink dark:text-white uppercase transition-all duration-500">
                  {viewState === 'result' ? '天垂象' : viewState === 'interpretation' ? '指点迷津' : viewState === 'deep_interpretation' ? '深度解卦' : viewState === 'context_input' ? '诚心发问' : viewState === 'history' ? '测算记录' : ''}
                </span>
                {viewState === 'input' && (
                  <span className="text-[9px] font-medium tracking-[0.2em] text-stone-400 dark:text-stone-600 opacity-80 animate-in fade-in duration-1000">
                    测算结果仅参考，不代表专业测评
                  </span>
                )}
              </>
           )}
        </div>

        <button 
          onClick={() => setShowDisclaimer(true)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-stone-400 dark:text-stone-500"
        >
          <Icon name="help_outline" className="text-[20px]" />
        </button>
      </header>

      {/* Main Content Area - Scrollable */}
      <main className="relative z-10 flex-1 w-full overflow-y-auto scrollbar-hide overscroll-contain">
        
        {/* VIEW 1: TOPIC SELECTION */}
        {viewState === 'input' && (
          <div className="min-h-full flex flex-col items-center justify-center px-6 pb-12 py-10">
            <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center w-full">
              <div className="flex items-center justify-center gap-8 mb-10 w-full max-w-[340px] mx-auto">
                <div className="flex flex-col items-center gap-3 py-2 shrink-0">
                   <div className="writing-vertical text-4xl font-bold text-ink dark:text-white font-display tracking-[0.2em] leading-none opacity-90 drop-shadow-sm select-none">心中</div>
                   <div className="writing-vertical text-4xl font-bold text-ink dark:text-white font-display tracking-[0.2em] leading-none opacity-90 drop-shadow-sm select-none">所惑</div>
                   <div className="w-6 h-6 rounded-full border border-stone-300 dark:border-stone-600 flex items-center justify-center mt-3 opacity-60">
                      <span className="text-[10px] font-serif text-stone-500">问</span>
                   </div>
                </div>
                <div className="relative size-52 sm:size-56 group cursor-pointer shrink-0">
                   <div className="absolute inset-0 rounded-full border border-stone-800/5 dark:border-white/5 scale-[1.08]"></div>
                   <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-700 ease-out group-hover:scale-[1.02] bg-stone-200">
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-90 dark:opacity-80 transition-transform duration-[60s] ease-linear group-hover:scale-110"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&q=80')" }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-stone-200/20 via-transparent to-stone-900/10 mix-blend-overlay"></div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="text-center mb-8 flex flex-col items-center gap-1">
                 <div className="flex items-center gap-3 text-stone-300 dark:text-stone-700">
                    <span className="h-[1px] w-8 bg-current"></span>
                    <span className="text-[10px] font-serif tracking-[0.4em] text-stone-400">诚意正心 · 感而遂通</span>
                    <span className="h-[1px] w-8 bg-current"></span>
                 </div>
              </div>

              <div className="w-full max-w-sm mb-10">
                 <div className="grid grid-cols-4 gap-3">
                    {DIVINATION_TOPICS.map((topic) => {
                       const isSelected = selectedTopic === topic.id;
                       return (
                          <button key={topic.id} onClick={() => setSelectedTopic(topic.id)} className={`group relative flex flex-col items-center justify-center py-2 transition-all duration-300`}>
                             <div className={`size-14 rounded-2xl mb-2 flex items-center justify-center transition-all duration-300 border ${isSelected ? 'bg-cinnabar/5 border-cinnabar text-cinnabar shadow-lg shadow-cinnabar/10 scale-105' : 'bg-white/50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-400 hover:border-stone-300 hover:text-stone-600'}`}>
                                <Icon name={topic.icon} className={isSelected ? "text-[24px]" : "text-[22px]"} />
                             </div>
                             <span className={`text-[11px] font-bold tracking-widest transition-colors ${isSelected ? 'text-cinnabar' : 'text-stone-400 dark:text-stone-500'}`}>{topic.label}</span>
                          </button>
                       );
                    })}
                 </div>
              </div>

              <button onClick={handleDivinationStart} className="w-full max-w-[200px] h-12 relative overflow-hidden rounded-full bg-cinnabar text-white shadow-xl shadow-cinnabar/30 hover:shadow-2xl hover:shadow-cinnabar/40 hover:bg-[#b02a2a] transition-all duration-500 active:scale-95 group mt-2">
                  <div className="absolute inset-0 flex items-center justify-center gap-2 relative z-10">
                     <Icon name="fingerprint" className="text-white/80 text-[18px]" />
                     <span className="text-base font-bold tracking-[0.3em] ml-1 font-display">诚心起卦</span>
                  </div>
              </button>
            </div>
          </div>
        )}

        {/* VIEW: HISTORY LIST */}
        {viewState === 'history' && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full min-h-full flex flex-col px-6 pb-12">
            <div className="flex-1 py-4 space-y-3">
              {history.length > 0 ? (
                history.map((record) => {
                  const hex = HEXAGRAMS.find(h => h.id === record.hexagramId);
                  const topic = DIVINATION_TOPICS.find(t => t.id === record.topicId);
                  const dateStr = new Date(record.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <button 
                      key={record.id}
                      onClick={() => loadHistoryItem(record)}
                      className="w-full text-left p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/5 flex items-center gap-4 hover:bg-white transition-all active:scale-[0.98]"
                    >
                      <div className="size-10 shrink-0 bg-stone-100 dark:bg-white/10 rounded-full flex items-center justify-center">
                         <Icon name={topic?.icon || 'help'} className="text-stone-500 text-[20px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="text-sm font-bold text-ink dark:text-white truncate">
                            {hex?.name || '未知卦'} <span className="text-[10px] font-normal text-stone-400 ml-2">{dateStr}</span>
                          </h4>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate opacity-80">
                          {record.query || '未记录所问'}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col gap-[2px] w-6 opacity-30">
                        {hex?.structure.slice(0, 3).map((l, i) => (
                           <div key={i} className="h-[2px] w-full flex justify-between">
                              {l === 1 ? <div className="w-full h-full bg-current rounded-full"></div> : <><div className="w-[40%] h-full bg-current rounded-full"></div><div className="w-[40%] h-full bg-current rounded-full"></div></>}
                           </div>
                        ))}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4 mt-20">
                  <Icon name="history" className="text-[48px]" />
                  <p className="text-sm tracking-widest font-serif">暂无测算记录</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 1.5: CONTEXT INPUT */}
        {viewState === 'context_input' && (
           <div className="min-h-full flex flex-col items-center justify-center px-6 pb-12 py-10">
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 w-full max-w-sm flex flex-col items-center">
                <div className="w-full mb-10">
                  <label className="block text-center text-sm font-bold text-ink dark:text-white mb-6 tracking-[0.2em] opacity-80">所问何事</label>
                  <div className="relative w-full">
                     <textarea
                       value={userQuery}
                       onChange={(e) => setUserQuery(e.target.value)}
                       placeholder="默念心中所惑，简要记之..."
                       className="w-full h-32 bg-transparent border-0 border-b border-stone-300 dark:border-stone-700 text-center text-lg font-display text-ink dark:text-white placeholder-stone-400 focus:ring-0 focus:border-cinnabar transition-colors resize-none p-4 leading-relaxed"
                     ></textarea>
                     <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-stone-300 dark:border-stone-700 opacity-50"></div>
                     <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-stone-300 dark:border-stone-700 opacity-50"></div>
                  </div>
                </div>

                <div className="w-full mb-12">
                   <label className="block text-center text-sm font-bold text-ink dark:text-white mb-6 tracking-[0.2em] opacity-80">当前境遇</label>
                   <div className="flex justify-between items-center gap-4 px-2">
                      {[
                        { id: DivinationContext.PROSPERITY, label: '顺境', icon: 'wb_sunny' },
                        { id: DivinationContext.STABLE, label: '平境', icon: 'waves' },
                        { id: DivinationContext.ADVERSITY, label: '逆境', icon: 'thunderstorm' }
                      ].map((ctx) => {
                        const isActive = userContext === ctx.id;
                        return (
                          <button key={ctx.id} onClick={() => setUserContext(ctx.id as DivinationContext)} className={`flex-1 h-24 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all duration-300 active:scale-95 ${isActive ? 'bg-cinnabar text-white border-cinnabar shadow-lg shadow-cinnabar/20' : 'bg-white/50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-500 hover:bg-white dark:hover:bg-white/10'}`}>
                             <Icon name={ctx.icon} className={isActive ? 'text-[28px]' : 'text-[24px]'} />
                             <span className="text-xs font-bold tracking-widest">{ctx.label}</span>
                          </button>
                        );
                      })}
                   </div>
                </div>

                <button onClick={handleRealStart} className="w-full max-w-[200px] h-12 relative overflow-hidden rounded-full bg-ink dark:bg-white text-white dark:text-black shadow-xl hover:shadow-2xl transition-all duration-500 active:scale-95 group mt-2">
                    <div className="absolute inset-0 flex items-center justify-center gap-2 relative z-10">
                       <span className="text-base font-bold tracking-[0.3em] ml-1 font-display">开始测算</span>
                       <Icon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
             </div>
           </div>
        )}

        {/* VIEW 3: RESULT REVELATION */}
        {viewState === 'result' && resultHexagram && (
           <div className="min-h-full flex flex-col items-center justify-center px-6 pb-12 py-10">
              <div className="animate-in fade-in duration-1000 w-full flex flex-col items-center max-w-sm">
                 <div className="flex flex-col gap-3 mb-12 scale-125 origin-top mt-8">
                    {[...resultHexagram.structure].reverse().map((line, idx) => (
                       <div key={idx} className="w-40 h-3.5 flex justify-between animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards" style={{ animationDelay: `${idx * 200}ms`, animationDuration: '1000ms' }}>
                          {line === 1 ? <div className="w-full h-full bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 dark:from-stone-300 dark:via-white dark:to-stone-300 rounded-[1px] opacity-90 shadow-sm"></div> : <><div className="w-[42%] h-full bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 dark:from-stone-300 dark:via-white dark:to-stone-300 rounded-[1px] opacity-90 shadow-sm"></div><div className="w-[42%] h-full bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 dark:from-stone-300 dark:via-white dark:to-stone-300 rounded-[1px] opacity-90 shadow-sm"></div></>}
                       </div>
                    ))}
                 </div>
                 <div className="flex flex-row-reverse items-start justify-center gap-12 w-full px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-backwards">
                    <div className="flex flex-col items-center gap-3">
                       <h2 className="writing-vertical text-5xl font-bold text-ink dark:text-white font-display tracking-[0.15em] leading-relaxed">{resultHexagram.name}</h2>
                       <div className="w-8 h-8 border border-cinnabar/40 rounded p-0.5 mt-2 opacity-80 mix-blend-multiply dark:mix-blend-screen">
                          <div className="w-full h-full border border-cinnabar/60 flex items-center justify-center">
                             <span className="text-[10px] text-cinnabar font-bold writing-vertical leading-none">{resultHexagram.tag?.substring(0,2) || "上吉"}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col gap-6 pt-2 max-w-[160px]">
                       <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                          <span className="text-xs uppercase tracking-widest font-serif">{resultHexagram.pinyin}</span>
                          <span className="h-[1px] w-4 bg-stone-300"></span>
                       </div>
                       <p className="text-sm text-ink/80 dark:text-stone-200 font-display leading-loose text-justify">{resultHexagram.judgment.substring(0, 60)}...</p>
                       <p className="text-xs text-stone-400 font-sans leading-relaxed">{resultHexagram.english}</p>
                       <button onClick={handleAnalyzeStart} className="mt-4 flex items-center gap-2 text-cinnabar hover:text-red-700 transition-colors group self-start">
                          <span className="text-xs font-bold tracking-widest border-b border-cinnabar/30 pb-0.5">解卦</span>
                          <Icon name="arrow_forward" className="text-xs group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW 4: MODERN INTERPRETATION */}
        {viewState === 'interpretation' && resultHexagram && (
           <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full min-h-full pb-12 px-6">
              <div className="max-w-md mx-auto pt-6">
                 <div className="bg-white/60 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
                    <div className="p-6 bg-stone-50/50 dark:bg-black/20 border-b border-stone-100 dark:border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                           <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">{userContext === DivinationContext.PROSPERITY ? '顺境' : userContext === DivinationContext.ADVERSITY ? '逆境' : '平境'}</span>
                           <span className="text-[10px] text-stone-400 uppercase tracking-widest font-serif">Question</span>
                        </div>
                        <p className="text-lg font-display text-ink dark:text-white leading-relaxed italic opacity-90">"{userQuery || "心中所惑..."}"</p>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="size-10 rounded-full bg-ink dark:bg-white text-white dark:text-black flex items-center justify-center font-bold font-serif shadow-md">{resultHexagram.name[0]}</div>
                           <div>
                              <h3 className="text-sm font-bold text-ink dark:text-white">{resultHexagram.name} · {resultHexagram.tag}</h3>
                              <p className="text-[10px] text-stone-500 uppercase">{resultHexagram.english}</p>
                           </div>
                        </div>
                        <h2 className="text-xl font-bold text-cinnabar mb-4 font-display">{advice.title}</h2>
                        <p className="text-sm leading-7 text-stone-700 dark:text-stone-300 mb-6 text-justify">{advice.body}</p>
                        <div className="space-y-3 bg-stone-100/50 dark:bg-white/5 p-4 rounded-xl">
                           <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">建议 Action</h4>
                           {advice.points.map((point, idx) => (
                              <div key={idx} className="flex gap-3 items-start">
                                 <Icon name="check_circle" className="text-[16px] text-green-600/70 mt-0.5" />
                                 <p className="text-sm text-stone-600 dark:text-stone-400 leading-snug">{point}</p>
                              </div>
                           ))}
                        </div>
                    </div>
                 </div>

                 <div className="mt-8 px-4">
                    {/* RITUAL PASSPHRASE INPUT SECTION */}
                    <div className="relative mb-6">
                       {/* Decorative background for the ritual area */}
                       <div className={`absolute -inset-4 rounded-2xl transition-all duration-700 ${passphrase === '心神下潜' ? 'bg-gradient-to-b from-cinnabar/5 to-transparent' : 'bg-transparent'}`}></div>
                       
                       <div className="relative flex flex-col items-center gap-4">
                          
                          {/* The Prompt / Label */}
                          <div className={`flex flex-col items-center gap-1 transition-all duration-500 ${passphrase === '心神下潜' ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                             <Icon name="psychology" className="text-stone-300 dark:text-stone-600 text-xl animate-pulse" />
                             <span className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">Deep Insight Ritual</span>
                          </div>

                          {/* The Input Container */}
                          <div className="relative w-full max-w-[260px]">
                             <input 
                               type="text" 
                               value={passphrase}
                               onChange={(e) => setPassphrase(e.target.value)}
                               placeholder="请输入 “心神下潜”"
                               className={`w-full text-center bg-transparent border-b text-lg font-display tracking-[0.4em] focus:ring-0 focus:outline-none transition-all duration-700 py-3
                                  ${passphrase === '心神下潜' 
                                     ? 'border-cinnabar text-cinnabar scale-110 font-bold drop-shadow-sm' 
                                     : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 focus:border-stone-500 placeholder:text-gold/60 dark:placeholder:text-gold/60 placeholder:text-sm placeholder:font-normal'
                                  }
                               `}
                             />
                             
                             {/* The Seal Effect - Appears when correct */}
                             {passphrase === '心神下潜' && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none flex items-center justify-center z-10">
                                   <div className="size-20 border-[3px] border-cinnabar rounded opacity-20 rotate-12 absolute"></div>
                                   <div className="absolute -right-8 -top-8 rotate-[20deg] animate-in zoom-in duration-500">
                                        <div className="size-14 rounded border-2 border-cinnabar bg-cinnabar/10 text-cinnabar flex items-center justify-center shadow-lg backdrop-blur-sm">
                                           <div className="absolute inset-0 border border-cinnabar m-0.5 opacity-50 rounded-[1px]"></div>
                                           <span className="font-display font-bold text-lg writing-vertical-rl select-none">印可</span>
                                        </div>
                                   </div>
                                </div>
                             )}
                          </div>

                          {/* Helper Text */}
                          <p className={`text-[10px] font-serif transition-all duration-500 ${passphrase === '心神下潜' ? 'text-cinnabar tracking-[0.3em] font-bold opacity-100 translate-y-2' : 'text-stone-400 tracking-widest opacity-80'}`}>
                             {passphrase === '心神下潜' ? "· 诚 意 正 心 ·" : "输入口令开启深度解卦"}
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-8">
                       <button onClick={handleReset} className="flex-1 py-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-400 dark:text-stone-500 text-xs font-bold tracking-widest hover:bg-white dark:hover:bg-white/5 transition-all active:scale-[0.98]">
                          心神已定
                       </button>
                       <button 
                         onClick={handleDeepAnalyzeStart} 
                         disabled={passphrase !== '心神下潜'}
                         className={`flex-[1.6] py-3.5 rounded-2xl text-xs font-bold tracking-widest transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${passphrase === '心神下潜' ? 'bg-cinnabar text-white shadow-xl shadow-cinnabar/30 active:scale-[0.98] hover:bg-[#b02a2a]' : 'bg-stone-200 text-stone-400 dark:bg-stone-800 dark:text-stone-600 cursor-not-allowed grayscale'}`}
                       >
                          {/* Button Shine Effect when active */}
                          {passphrase === '心神下潜' && (
                              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                          )}
                          <Icon name="auto_awesome" className={`text-[18px] ${passphrase === '心神下潜' ? 'group-hover:rotate-12 transition-transform' : ''}`} />
                          深度解卦
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW 5: DEEP INTERPRETATION (NEW PAGE) */}
        {viewState === 'deep_interpretation' && resultHexagram && deepContent && (
           <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 w-full min-h-full pb-10 px-4">
              <div className="max-w-md mx-auto relative pt-4">
                 {/* Hexagram Background Watermark - Adjusted z-index */}
                 <div className="fixed top-32 right-[-60px] text-[240px] font-bold text-ink/5 dark:text-white/5 pointer-events-none rotate-12 blur-[2px] z-0 font-display select-none">
                    {resultHexagram.name[0]}
                 </div>

                 {/* NEW HERO CARD */}
                 <div className="relative z-10 w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl mb-8 group bg-stone-200 dark:bg-stone-800 ring-1 ring-black/5 dark:ring-white/10">
                     {/* Background Image */}
                     <div className="absolute inset-0">
                        {resultHexagram.image ? (
                           <img 
                             src={resultHexagram.image} 
                             alt={resultHexagram.name}
                             className="w-full h-full object-cover transition-transform duration-[30s] ease-linear group-hover:scale-110 opacity-90 dark:opacity-60 mix-blend-multiply dark:mix-blend-normal"
                           />
                        ) : (
                           <div className="w-full h-full bg-stone-300 dark:bg-stone-700"></div>
                        )}
                        {/* Gradients for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-transparent to-stone-900/10 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
                     </div>

                     {/* Floating Hexagram Lines */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center -translate-y-8">
                        <div className="flex flex-col gap-4 drop-shadow-2xl">
                           {[...resultHexagram.structure].reverse().map((line, idx) => (
                              <div key={idx} className="w-32 h-3.5 flex justify-between animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards" style={{ animationDelay: `${idx * 150 + 500}ms` }}>
                                 {line === 1 ? (
                                    <div className="w-full h-full bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.3)] backdrop-blur-sm rounded-[2px]"></div>
                                 ) : (
                                    <>
                                       <div className="w-[42%] h-full bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.3)] backdrop-blur-sm rounded-[2px]"></div>
                                       <div className="w-[42%] h-full bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.3)] backdrop-blur-sm rounded-[2px]"></div>
                                    </>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Card Content Bottom */}
                     <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-center text-white">
                        <div className="flex items-center gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 delay-1000 fill-mode-backwards">
                           <div className="px-2.5 py-0.5 rounded border border-white/30 bg-black/20 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase">
                              {resultHexagram.english}
                           </div>
                           <div className="w-px h-3 bg-white/40"></div>
                           <div className="text-[10px] font-bold tracking-widest uppercase opacity-80">
                              {userContext === DivinationContext.PROSPERITY ? '顺境' : userContext === DivinationContext.ADVERSITY ? '逆境' : '平境'}
                           </div>
                        </div>
                        <h2 className="text-5xl font-bold font-display tracking-[0.2em] mb-1 drop-shadow-lg animate-in fade-in zoom-in-95 delay-700 fill-mode-backwards text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70">
                           {resultHexagram.name}
                        </h2>
                        <p className="text-sm font-serif italic tracking-widest opacity-80 mb-4 animate-in fade-in delay-1000 fill-mode-backwards">
                           {resultHexagram.pinyin}
                        </p>
                        
                        {/* Decorative Element */}
                        <div className="w-12 h-1 bg-cinnabar rounded-full shadow-[0_0_10px_rgba(196,54,54,0.8)] animate-pulse"></div>
                     </div>
                     
                     {/* Tag Badge Top Right */}
                     <div className="absolute top-6 right-6">
                        <div className="size-12 rounded-full border border-white/20 bg-black/10 backdrop-blur-md flex items-center justify-center shadow-lg">
                           <span className="text-white font-display font-bold text-lg">{resultHexagram.tag?.substring(0,1)}</span>
                        </div>
                     </div>
                 </div>

                 {/* New: Keywords Row */}
                 <div className="flex justify-center gap-2 mb-8 relative z-10 flex-wrap">
                    {deepContent.keywords.map((kw, i) => (
                       <span key={i} className="px-3 py-1 rounded-full bg-stone-100/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-[10px] text-stone-500 font-bold tracking-widest backdrop-blur-sm">
                          {kw}
                       </span>
                    ))}
                 </div>

                 <div className="space-y-6 relative z-10 px-1">
                    {/* New: Wisdom Quote Section */}
                    <div className="text-center mb-6">
                       <Icon name="format_quote" className="text-stone-300 dark:text-stone-600 text-3xl mb-2 rotate-180" />
                       <p className="text-lg font-display font-bold text-ink dark:text-white leading-relaxed px-4">
                          {deepContent.quote}
                       </p>
                       <div className="h-8 w-[1px] bg-stone-300 dark:bg-stone-700 mx-auto mt-4"></div>
                    </div>

                    {/* Section 1: Essence (Existing) */}
                    <section className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-white/5">
                       <div className="flex items-center gap-3 mb-4">
                          <Icon name="psychology" className="text-cinnabar" />
                          <h3 className="text-sm font-bold text-ink dark:text-white tracking-widest">卦义核心 The Essence</h3>
                       </div>
                       <p className="text-sm text-stone-700 dark:text-stone-300 leading-7 text-justify font-display">
                          {resultHexagram.judgment}
                       </p>
                    </section>

                    {/* Section 3: Situation Analysis (Existing) */}
                    <section className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-white/5">
                       <div className="flex items-center gap-3 mb-4">
                          <Icon name="query_stats" className="text-emerald-600 dark:text-emerald-400" />
                          <h3 className="text-sm font-bold text-ink dark:text-white tracking-widest">时势分析 Current Situation</h3>
                       </div>
                       <div className="space-y-4">
                          <div className="flex gap-4 items-start">
                             <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                             <div>
                                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">环境能量</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">
                                   当前环境能量{userContext === DivinationContext.PROSPERITY ? '充沛且积极' : userContext === DivinationContext.ADVERSITY ? '受阻且晦暗' : '平稳但蕴含变化'}。
                                   {resultHexagram.structure[0] === 1 ? '初爻为阳，根基尚稳。' : '初爻为阴，根基需固。'}
                                </p>
                             </div>
                          </div>
                          <div className="flex gap-4 items-start">
                             <div className="mt-1 size-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                             <div>
                                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">潜在风险</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">
                                   {userContext === DivinationContext.ADVERSITY ? '需防小人暗算或内部矛盾激化。' : '切忌盲目乐观，需防盛极而衰。'}
                                </p>
                             </div>
                          </div>
                       </div>
                    </section>

                    {/* Updated: Philosophical Guidance with richer content AND Prediction Probability */}
                    <section className="bg-gradient-to-br from-stone-800 to-black text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-10 opacity-10">
                          <Icon name="auto_awesome" className="text-[100px]" />
                       </div>
                       <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-6">
                              <span className="w-1 h-4 bg-gold rounded-full"></span>
                              <h3 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">哲学启示 Philosophy</h3>
                          </div>

                          {/* NEW: Prediction Probability Gauge */}
                          <div className="flex items-center gap-4 mb-6 bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                              <div className="relative size-12 shrink-0">
                                  {/* Background Circle */}
                                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                      <path className="text-white/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                      {/* Progress Circle */}
                                      <path 
                                        className="text-gold transition-all duration-1000 ease-out" 
                                        strokeDasharray={`${predictionScore}, 100`} 
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="3" 
                                        strokeLinecap="round" 
                                      />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gold">{predictionScore}%</div>
                              </div>
                              <div>
                                  <h5 className="text-sm font-bold text-white mb-0.5 tracking-wider">吉遇指数 Fortune</h5>
                                  <p className="text-[10px] text-stone-400 leading-tight">基于{userContext === DivinationContext.PROSPERITY ? '顺境' : userContext === DivinationContext.ADVERSITY ? '逆境' : '平境'}与{resultHexagram.name}之象推演</p>
                              </div>
                          </div>
                          
                          <div className="mb-6">
                             <h4 className="text-lg font-display font-bold mb-2">{deepContent.concept.title}</h4>
                             <p className="text-xs text-stone-400 leading-relaxed">{deepContent.concept.desc}</p>
                          </div>

                          <div className="h-px w-full bg-white/10 my-6"></div>
                          
                          <p className="text-sm leading-7 text-stone-300 text-justify font-display opacity-90">
                             {deepContent.detailed}
                          </p>
                          
                          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between opacity-60">
                             <span className="text-[10px] uppercase tracking-widest">I Ching Wisdom</span>
                             <Icon name="spa" className="text-xs" />
                          </div>
                       </div>
                    </section>
                 </div>
                 
                 <div className="mt-12 text-center pb-8">
                    <p className="text-[10px] text-stone-400 font-serif italic">—— 易经 · {resultHexagram.name} ——</p>
                 </div>
              </div>
           </div>
        )}

      </main>

      {/* OVERLAYS: Casting & Analyzing (Moved out of Scrollable Main) */}
      
      {/* VIEW 2: CASTING RITUAL */}
      {viewState === 'casting' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-parchment to-parchment-shade dark:from-ink-base dark:to-ink-deep animate-in fade-in duration-1000 overflow-hidden">
            <div className="absolute inset-0 opacity-40 mix-blend-multiply dark:mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}></div>
            <div className="relative flex items-center justify-center">
                <div className="absolute size-32 bg-stone-900/10 dark:bg-white/10 rounded-full blur-2xl animate-[ink-spread_4s_ease-out_infinite]"></div>
                <div className="absolute size-32 bg-stone-800/10 dark:bg-white/10 rounded-full blur-3xl animate-[ink-spread_4s_ease-out_infinite_1.5s]"></div>
                <div className="relative size-4 bg-ink dark:bg-white rounded-full opacity-20 blur-sm animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute size-48 border border-stone-400/20 dark:border-white/10 rounded-full blur-[1px] animate-[spin-slow_20s_linear_infinite]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-6 mt-16 mix-blend-darken dark:mix-blend-screen">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl font-display font-bold tracking-[0.5em] text-ink/80 dark:text-white/80 ml-4 animate-pulse">凝神</span>
                  <div className="h-[1px] w-8 bg-stone-400/50"></div>
                  <span className="text-[10px] font-serif text-stone-400 tracking-[0.4em] uppercase opacity-70">Meditation</span>
                </div>
            </div>
          </div>
      )}

      {/* VIEW 2.5: ANALYZING */}
      {viewState === 'analyzing' && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-parchment to-parchment-shade dark:from-ink-base dark:to-ink-deep animate-in fade-in duration-1000 overflow-hidden">
            <div className="absolute inset-0 opacity-40 mix-blend-multiply dark:mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}></div>
            <div className="relative flex items-center justify-center">
                {/* Dynamic Ink/Gold Spreading Blobs - Referencing Casting's ink-spread */}
                <div className="absolute size-40 bg-gold/20 dark:bg-gold/10 rounded-full blur-2xl animate-[ink-spread_4s_ease-out_infinite]"></div>
                <div className="absolute size-40 bg-cinnabar/10 dark:bg-cinnabar/20 rounded-full blur-3xl animate-[ink-spread_4s_ease-out_infinite_1.5s]"></div>
                
                {/* Concentric Rotating Rings - Symbolizing Structure/Logic emerging */}
                <div className="absolute size-48 border border-stone-400/20 dark:border-white/10 rounded-full blur-[0.5px] animate-[spin-slow_15s_linear_infinite]"></div>
                <div className="absolute size-36 border border-stone-400/30 dark:border-white/20 rounded-full blur-[0.5px] animate-[spin-slow_10s_linear_infinite_reverse]"></div>
                
                {/* Center Core */}
                <div className="relative size-3 bg-cinnabar dark:bg-white rounded-full opacity-80 shadow-[0_0_20px_rgba(196,54,54,0.6)] animate-pulse"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center gap-6 mt-16 mix-blend-darken dark:mix-blend-screen">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl font-display font-bold tracking-[0.5em] text-ink/80 dark:text-white/80 ml-4 animate-pulse duration-[3000ms]">参悟</span>
                  <div className="h-[1px] w-8 bg-stone-400/50"></div>
                  <span className="text-[10px] font-serif text-stone-400 tracking-[0.4em] uppercase opacity-70">Insight</span>
                </div>
            </div>
          </div>
      )}

      {/* VIEW 2.8: DEEP ANALYZING */}
      {viewState === 'deep_analyzing' && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-b from-ink-base to-black animate-in fade-in duration-1000 overflow-hidden text-white">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black"></div>
            <div className="relative flex items-center justify-center scale-150">
                <div className="absolute size-64 rounded-full border border-white/5 animate-[spin_12s_linear_infinite]"></div>
                <div className="absolute size-56 rounded-full border border-white/10 border-dashed animate-[spin_8s_linear_infinite_reverse]"></div>
                <div className="absolute size-40 rounded-full border border-white/20 animate-[spin_15s_linear_infinite]"></div>
                <div className="absolute size-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute size-2 bg-white rounded-full shadow-[0_0_30px_10px_rgba(255,255,255,0.4)]"></div>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-6 mt-32">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-5xl font-display font-bold tracking-[0.6em] text-white ml-6 animate-in fade-in zoom-in duration-[2000ms] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">玄览</span>
                  <div className="h-[1px] w-12 bg-white/30"></div>
                  <span className="text-[10px] font-serif text-white/50 tracking-[0.6em] uppercase">Deep Observation</span>
                </div>
            </div>
          </div>
      )}

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowDisclaimer(false)}></div>
          <div className="relative w-full max-w-sm h-[70vh] bg-parchment dark:bg-background-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in zoom-in-95 duration-300">
             <div className="flex-none p-4 border-b border-stone-200 dark:border-white/10 flex justify-between items-center">
                <h3 className="text-sm font-bold tracking-widest text-ink dark:text-white">免责声明</h3>
                <button onClick={() => setShowDisclaimer(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                   <Icon name="close" className="text-lg" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans text-justify scrollbar-hide">
                <p>欢迎使用本小程序。在您浏览、访问或使用本程序提供的任何内容与服务前，请您务必仔细、完整地阅读并透彻理解本《免责声明》。您的任何使用行为即视为您已阅读、理解并完全同意接受本声明全部条款的约束。若您不同意本声明任何内容，请立即停止使用本程序。</p>
                
                <section>
                   <h4 className="font-bold text-ink dark:text-white mb-2">一、 服务性质与宗旨声明</h4>
                   <p>本小程序是一个致力于传播中华优秀传统文化，特别是国学精粹与易学知识，并提供心灵陪伴与人生启发的数字化平台。我们提供的所有内容，包括但不限于文章、图文、音频、互动测试及咨询服务，其根本宗旨在于：</p>
                   <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>学术性与文化性传承：以严谨、尊重的态度，系统介绍周易、国学等相关领域的哲学思想、历史渊源与文化内涵，旨在促进用户对中华智慧的理解与思考。</li>
                      <li>心灵慰藉与启发：通过传统文化中的积极理念，为用户提供舒缓压力、启发思维、促进自我认知与内心成长的参考信息，属于人生疗愈与心灵陪伴范畴。</li>
                      <li>明确反对封建迷信：我们坚决反对任何形式的鬼神迷信、宿命论及怪力乱神之说。平台内容绝非精准的预测、算命或宿命判定，不提供任何关于财富、健康、婚恋等具体事项的必然性承诺或保证。</li>
                   </ul>
                </section>

                <section>
                   <h4 className="font-bold text-ink dark:text-white mb-2">二、 内容与信息免责</h4>
                   <p><strong>非专业建议：</strong>本平台所有内容仅为基于传统文化典籍的分享、研讨与通用性启发，不构成任何形式的医学、心理学、法律、金融投资或人生决策的专业意见、建议或指导。您因依赖本程序信息所作的任何决定或采取的任何行动，其全部风险与责任将由您自行独立承担。</p>
                   <p className="mt-2"><strong>仅供参考与娱乐：</strong>部分互动内容（如卦象查询、命理知识测试等）设计初衷是为增强文化体验的趣味性，其输出结果具有通用性、启发性和娱乐性，绝非对个人命运或具体事件的精准论断。请您以理性、思辨的态度对待，切勿沉迷或据此作出重大人生决策。</p>
                   <p className="mt-2"><strong>准确性不作担保：</strong>我们力求内容准确，但不对其完整性、及时性或适用性作任何明示或默示的担保。传统文化解读多元，本平台内容仅为一家之言，不排除存在疏漏或不同学术观点的可能。</p>
                </section>

                <section>
                   <h4 className="font-bold text-ink dark:text-white mb-2">三、 用户责任与行为准则</h4>
                   <p><strong>理性使用与独立判断：</strong>您承诺以成熟、理性的态度使用本程序，并保持独立的个人判断。您理解并同意，您的人生选择与责任完全在于自身，本程序内容仅为辅助您思考的参考素材之一。</p>
                   <p className="mt-2"><strong>遵守法律法规：</strong>您在使用本程序时，必须遵守中华人民共和国一切现行法律法规，不得利用本程序内容从事任何违法、违背公序良俗或侵害他人合法权益的活动。</p>
                   <p className="mt-2"><strong>不适用于未成年人：</strong>本程序部分内容涉及抽象哲学与人生议题，可能超出未成年人的理解范畴。我们不建议未成年人单独使用，监护人应予以指导和监督。</p>
                   <p className="mt-2"><strong>紧急情况免责：</strong>如果您正面临严重的心理困扰、精神疾病或任何生活危机，请务必立即寻求合格的心理医生、精神科医师或其他专业医疗人员的帮助。本程序无法替代专业的诊断与治疗。</p>
                </section>

                <section>
                   <h4 className="font-bold text-ink dark:text-white mb-2">四、 知识产权声明</h4>
                   <p>本程序内所有由我们独立创作的文字、图片、音频、界面设计等，其知识产权均归我们或相关权利人所有。未经明确书面授权，任何个人或组织不得擅自复制、转载、修改或用于商业目的。涉及传统文化典籍的公共领域内容，其传播行为旨在促进学术与文化传播。</p>
                </section>

                <section>
                   <h4 className="font-bold text-ink dark:text-white mb-2">五、 其他</h4>
                   <p>我们保留根据法律法规变化及运营需要，随时更新本免责声明的权利。更新后的声明将在小程序内公布即生效。若本声明任何条款被认定为无效，不影响其余条款的继续有效。</p>
                </section>

                <p className="pt-4 border-t border-stone-200 dark:border-white/10 italic text-stone-500">最后，我们诚挚希望本小程序能成为您探索国学智慧、滋养心灵的一扇窗。愿您在此获得启发与安宁，并以更积极、自主的态度面对生活的无限可能。</p>
             </div>
             <div className="flex-none p-4 bg-stone-50 dark:bg-white/5 flex justify-center">
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="w-full py-2.5 rounded-xl bg-cinnabar text-white font-bold tracking-widest text-sm shadow-md active:scale-95 transition-all"
                >
                   我已阅读并知晓
                </button>
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
