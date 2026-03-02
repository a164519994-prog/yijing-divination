import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Icon } from '../components/Icon';
import { HEXAGRAMS, BACKGROUND_TEXTURE } from '../constants';
import { Hexagram } from '../types';

export const BookOfChanges: React.FC = () => {
  const [selectedHexagram, setSelectedHexagram] = useState<Hexagram | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load favorites on mount
  useEffect(() => {
    const saved = localStorage.getItem('divination_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
      localStorage.setItem('divination_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const filteredHexagrams = HEXAGRAMS.filter(hex => 
    hex.name.includes(searchQuery) || 
    hex.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hex.pinyin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <header className="flex-none relative z-20 flex items-center justify-between px-4 pt-6 pb-2 bg-parchment/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-stone-200/20 dark:border-white/5">
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-ink dark:text-white">
          <Icon name="arrow_back_ios_new" className="text-[20px]" />
        </button>
        <h1 className="text-sm font-bold tracking-widest text-ink dark:text-white opacity-90 text-center flex flex-col items-center leading-tight">
          <span>周易全书</span>
          <span className="text-[10px] font-normal tracking-wide opacity-80 mt-0.5 uppercase">Book of Changes</span>
        </h1>
        <button 
          onClick={() => setShowDisclaimer(true)}
          className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-ink dark:text-white"
        >
          <Icon name="info" className="text-[20px]" />
        </button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col overflow-y-auto pb-4 scrollbar-hide overscroll-contain">
        <div className="px-4 pb-6 pt-4">
          {/* Taiji / Bagua Hero Section */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 group bg-stone-200 dark:bg-stone-800 shadow-xl">
            <div className="absolute inset-0 bg-ink-wash bg-cover bg-top opacity-60 dark:opacity-30 mask-gradient-to-b grayscale contrast-125"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative size-44 md:size-52 scale-90">
                <div className="absolute inset-0 rounded-full border border-stone-800/10 dark:border-white/10 opacity-50 scale-110"></div>
                <div className="absolute inset-0 rounded-full border border-stone-800/10 dark:border-white/10 opacity-30 scale-125 border-dashed"></div>
                <div className="absolute inset-0 flex items-center justify-center animate-spin-very-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-xl font-bold text-ink dark:text-white">☰</div> 
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-xl font-bold text-ink dark:text-white">☷</div> 
                  <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 text-xl font-bold text-ink dark:text-white">☲</div> 
                  <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 text-xl font-bold text-ink dark:text-white">☵</div> 
                  <div className="absolute top-[15%] right-[15%] translate-x-2 -translate-y-2 text-xl font-bold text-ink dark:text-white">☴</div> 
                  <div className="absolute bottom-[15%] right-[15%] translate-x-2 translate-y-2 text-xl font-bold text-ink dark:text-white">☳</div> 
                  <div className="absolute bottom-[15%] left-[15%] -translate-x-2 translate-y-2 text-xl font-bold text-ink dark:text-white">☶</div> 
                  <div className="absolute top-[15%] left-[15%] -translate-x-2 -translate-y-2 text-xl font-bold text-ink dark:text-white">☱</div> 
                  
                  {/* Yin-Yang Centerpiece */}
                  <div className="w-20 h-20 rounded-full shadow-2xl transform rotate-90 relative z-10 border border-black/5 dark:border-white/10 overflow-hidden ring-4 ring-parchment dark:ring-background-dark">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-ink dark:bg-white"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#fcfaf5] dark:bg-ink"></div>
                    <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-ink dark:bg-white rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-1/2 h-1/2 bg-[#fcfaf5] dark:bg-ink rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-[18%] w-3 h-3 bg-[#fcfaf5] dark:bg-ink rounded-full -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-[18%] w-3 h-3 bg-ink dark:bg-white rounded-full -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Visual labels */}
            <div className="absolute bottom-3 left-4 flex flex-col">
               <span className="text-[10px] font-bold tracking-[0.4em] text-ink dark:text-white opacity-40 uppercase font-serif">Taiji Cosmology</span>
            </div>
          </div>

          {/* Search Bar - Enhanced with clear button */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="text-stone-400 group-focus-within:text-cinnabar transition-colors" />
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-10 py-3.5 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-stone-700 rounded-xl leading-5 placeholder-stone-400 focus:outline-none focus:bg-white/90 dark:focus:bg-white/10 focus:ring-1 focus:ring-cinnabar focus:border-cinnabar sm:text-sm transition-all shadow-sm backdrop-blur-md" 
              placeholder="搜索卦名、拼音或释义" 
              type="text"
            />
            {searchQuery && (
               <button 
                 onClick={() => setSearchQuery('')}
                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-300 hover:text-stone-500 transition-colors"
               >
                 <Icon name="cancel" className="text-lg" />
               </button>
            )}
          </div>
        </div>

        {/* List of Hexagrams */}
        <div className="flex-1 px-4 space-y-3 pb-8">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-cinnabar rounded-full"></span>
              六十四卦象 <span className="text-[10px] font-normal text-stone-500 ml-1 tracking-widest uppercase opacity-60">The 64 Visions</span>
            </h3>
            {searchQuery && (
               <span className="text-[10px] text-stone-400">找到 {filteredHexagrams.length} 项</span>
            )}
          </div>

          {filteredHexagrams.length > 0 ? (
            filteredHexagrams.map((hex, index) => (
              <HexagramRow 
                key={hex.id} 
                hex={hex} 
                index={index}
                isFavorite={favorites.includes(hex.id)}
                onClick={() => setSelectedHexagram(hex)} 
              />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center opacity-30 gap-4">
               <Icon name="search_off" className="text-5xl" />
               <p className="text-sm font-serif tracking-widest uppercase">无匹配结果</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Detail Modal */}
      {selectedHexagram && (
        <HexagramDetailModal 
          hexagram={selectedHexagram} 
          isFavorite={favorites.includes(selectedHexagram.id)}
          onToggleFavorite={() => toggleFavorite(selectedHexagram.id)}
          onClose={() => setSelectedHexagram(null)} 
        />
      )}

      {/* Info Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowDisclaimer(false)}></div>
          <div className="relative w-full max-w-sm bg-parchment dark:bg-background-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in zoom-in-95 duration-300">
             <div className="flex-none p-5 border-b border-stone-200 dark:border-white/10 flex justify-between items-center">
                <h3 className="text-sm font-bold tracking-widest text-ink dark:text-white font-display">周易简介 About</h3>
                <button onClick={() => setShowDisclaimer(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                   <Icon name="close" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans text-justify">
                <p>《周易》是中国传统思想文化中自然哲学与人文实践的理论根源，是古代汉民族思想智慧的结晶，被誉为“大道之源”。</p>
                <p>六十四卦是由八卦（乾、坤、震、巽、坎、离、艮、兑）两两相重而成。每一卦由六个爻组成，自下而上分别为初、二、三、四、五、上。</p>
                <p className="pt-4 border-t border-stone-100 dark:border-white/5 italic text-xs text-stone-500">本应用收录了完整的六十四卦辞与爻辞，旨在帮助用户在快节奏的现代生活中感受古典智慧的洗涤。</p>
             </div>
             <div className="p-4 bg-stone-50 dark:bg-white/5">
                <button onClick={() => setShowDisclaimer(false)} className="w-full py-2.5 rounded-xl bg-ink dark:bg-white text-white dark:text-black font-bold tracking-widest text-xs uppercase">知晓</button>
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

interface HexagramRowProps {
  hex: Hexagram;
  index: number;
  isFavorite: boolean;
  onClick: () => void;
}

const HexagramRow: React.FC<HexagramRowProps> = ({ hex, index, isFavorite, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group relative w-full text-left bg-white/40 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 rounded-xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center gap-4 cursor-pointer backdrop-blur-[2px] animate-in slide-in-from-bottom-2 fill-mode-backwards"
      style={{ animationDelay: `${Math.min(index * 30, 600)}ms` }}
    >
      <div className="flex flex-col gap-[3px] w-10 shrink-0 py-1 opacity-70 group-hover:opacity-100 transition-opacity">
        {[...hex.structure].reverse().map((line, idx) => (
          <div key={idx} className="flex justify-between w-full h-1">
            {line === 1 ? (
               <div className="w-full h-full bg-stone-800 dark:bg-white rounded-[1px]"></div>
            ) : (
              <><div className="w-[42%] h-full bg-stone-800 dark:bg-white rounded-[1px]"></div><div className="w-[42%] h-full bg-stone-800 dark:bg-white rounded-[1px]"></div></>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-baseline gap-2 min-w-0">
            <h4 className="text-lg font-bold text-ink dark:text-white truncate font-display tracking-wider group-hover:text-cinnabar transition-colors">{hex.name}</h4>
            <span className="text-[10px] font-serif italic text-stone-500 truncate uppercase tracking-widest opacity-80">{hex.pinyin.split(' ')[0]}</span>
          </div>
          {isFavorite && (
            <div className="animate-in zoom-in duration-300">
               <Icon name="bookmark" filled className="text-cinnabar text-sm drop-shadow-[0_0_5px_rgba(196,54,54,0.3)]" />
            </div>
          )}
        </div>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-sans truncate pr-2 tracking-wide font-medium">{hex.english}</p>
      </div>
      <div className="shrink-0 size-8 rounded-full border border-stone-200 dark:border-white/10 flex items-center justify-center text-stone-400 group-hover:text-cinnabar group-hover:border-cinnabar/30 transition-all bg-stone-50/50 dark:bg-transparent">
        <Icon name="chevron_right" className="text-sm" />
      </div>
    </button>
  );
};

interface TrigramData {
  name: string;
  nature: string;
  attr: string;
  lines: number[];
  color: string;
}

const getTrigramInfo = (lines: number[]): TrigramData => {
  const key = lines.join('');
  const dict: Record<string, Omit<TrigramData, 'lines'>> = {
    '111': { name: '乾', nature: '天', attr: '健', color: 'bg-blue-500' }, // Heaven (Blue/Sky)
    '000': { name: '坤', nature: '地', attr: '顺', color: 'bg-stone-600' }, // Earth (Stone/Ground)
    '001': { name: '震', nature: '雷', attr: '动', color: 'bg-yellow-500' }, // Thunder (Yellow/Flash)
    '110': { name: '巽', nature: '风', attr: '入', color: 'bg-emerald-500' }, // Wind (Green/Nature)
    '010': { name: '坎', nature: '水', attr: '险', color: 'bg-cyan-600' }, // Water (Cyan)
    '101': { name: '离', nature: '火', attr: '丽', color: 'bg-red-500' }, // Fire (Red)
    '100': { name: '艮', nature: '山', attr: '止', color: 'bg-stone-500' }, // Mountain (Stone)
    '011': { name: '兑', nature: '泽', attr: '悦', color: 'bg-indigo-400' }, // Lake (Indigo/Reflection)
  };
  return { ...dict[key], lines };
};

interface HexagramDetailModalProps {
  hexagram: Hexagram;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}

const HexagramDetailModal: React.FC<HexagramDetailModalProps> = ({ hexagram, isFavorite, onToggleFavorite, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  
  // Identify Trigrams
  const lowerLines = hexagram.structure.slice(0, 3);
  const upperLines = hexagram.structure.slice(3, 6);
  const lowerTrigram = getTrigramInfo(lowerLines);
  const upperTrigram = getTrigramInfo(upperLines);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 duration-300 ${isClosing ? 'opacity-0' : 'animate-in fade-in'}`}>
      <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-md" onClick={handleClose}></div>
      <div className={`relative w-full max-w-md h-[80vh] bg-parchment dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out transform ${isClosing ? 'scale-95 opacity-0' : 'animate-in zoom-in-95'}`}>
        <div className="absolute inset-0 opacity-40 mix-blend-multiply dark:mix-blend-overlay pointer-events-none z-0" style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}></div>
        
        {/* Generative Art Header - Replaces static image */}
        <div className="relative h-72 shrink-0 overflow-hidden bg-stone-900 flex flex-col items-center justify-center text-white">
           {/* Abstract Background Elements based on Trigram Colors */}
           <div className={`absolute top-[-20%] right-[-20%] size-96 rounded-full blur-[80px] opacity-40 mix-blend-screen ${upperTrigram.color}`}></div>
           <div className={`absolute bottom-[-20%] left-[-20%] size-96 rounded-full blur-[80px] opacity-40 mix-blend-screen ${lowerTrigram.color}`}></div>
           
           {/* Ink Texture Overlay */}
           <div className="absolute inset-0 bg-ink-wash bg-cover opacity-30 mix-blend-overlay contrast-125"></div>
           
           {/* The Hexagram Lines as "Landscape" / "Beams" in background */}
           <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 opacity-10 rotate-12 scale-150 pointer-events-none">
              {[...hexagram.structure].reverse().map((line, i) => (
                  <div key={i} className="w-64 h-8 flex justify-between">
                      {line === 1 ? (
                          <div className="w-full h-full bg-white rounded-sm blur-md"></div>
                      ) : (
                          <>
                              <div className="w-[42%] h-full bg-white rounded-sm blur-md"></div>
                              <div className="w-[42%] h-full bg-white rounded-sm blur-md"></div>
                          </>
                      )}
                  </div>
              ))}
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>

           {/* Controls */}
           <div className="absolute top-4 left-4 z-50 flex gap-2">
              <button onClick={handleClose} className="size-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors border border-white/10">
                <Icon name="close" className="text-[18px]" />
              </button>
           </div>
           <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={onToggleFavorite}
                className={`size-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 border shadow-lg ${isFavorite ? 'bg-cinnabar border-cinnabar text-white' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'}`}
              >
                <Icon name={isFavorite ? 'bookmark' : 'bookmark_border'} filled={isFavorite} className="text-[18px]" />
              </button>
           </div>

           {/* Center Content */}
           <div className="relative z-10 flex flex-col items-center gap-2 translate-y-4">
               {/* Visual Hexagram (Clean) */}
               <div className="flex flex-col gap-1.5 w-12 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {[...hexagram.structure].reverse().map((line, idx) => (
                     <div key={idx} className="flex justify-between w-full h-1.5">
                        {line === 1 ? (
                           <div className="w-full h-full bg-white/90 rounded-[1px] shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                        ) : (
                           <><div className="w-[42%] h-full bg-white/90 rounded-[1px] shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div><div className="w-[42%] h-full bg-white/90 rounded-[1px] shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div></>
                        )}
                     </div>
                  ))}
               </div>

               <div className="flex items-center gap-3">
                  <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/50"></div>
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white/70 uppercase font-serif">{hexagram.english}</span>
                  <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/50"></div>
               </div>
               
               <h2 className="text-5xl font-bold font-display tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 drop-shadow-lg mt-1">{hexagram.name}</h2>
               
               <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded border border-white/20 bg-white/5 backdrop-blur-sm text-[10px] font-bold text-white/80">{upperTrigram.nature}上{lowerTrigram.nature}下</span>
                  <span className="px-2 py-0.5 rounded bg-cinnabar/80 backdrop-blur-sm text-[10px] font-bold text-white shadow-lg shadow-cinnabar/20">{hexagram.tag || "上吉"}</span>
               </div>
           </div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          {/* Section 1: Judgment */}
          <section className="mb-8 relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-cinnabar/20 rounded-full"></div>
            <p className="text-lg leading-relaxed font-display text-justify text-ink/90 dark:text-white/90 italic indent-6">
               {hexagram.judgment}
            </p>
          </section>

          <div className="h-px w-full bg-stone-200 dark:border-white/10 mb-8 flex items-center justify-center">
             <div className="px-4 bg-parchment dark:bg-background-dark text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">卦象解构 Anatomy</div>
          </div>
          
          {/* Section 2: Trigram Anatomy */}
          <section className="mb-8 grid grid-cols-2 gap-4">
            {[upperTrigram, lowerTrigram].map((tri, i) => (
              <div key={i} className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-stone-100 dark:border-white/5 flex flex-col items-center relative overflow-hidden">
                 <div className={`absolute top-0 right-0 w-16 h-16 ${tri.color} opacity-10 rounded-bl-full`}></div>
                 <span className="text-[9px] text-stone-400 uppercase tracking-widest mb-2 relative z-10">{i === 0 ? '上卦 Upper' : '下卦 Lower'}</span>
                 <div className="flex flex-col gap-[3px] w-10 py-1 opacity-80 mb-3 relative z-10">
                    {[...tri.lines].reverse().map((line, idx) => (
                      <div key={idx} className="flex justify-between w-full h-1">
                        {line === 1 ? <div className="w-full h-full bg-ink dark:bg-white rounded-[1px]"></div> : <><div className="w-[42%] h-full bg-ink dark:bg-white rounded-[1px]"></div><div className="w-[42%] h-full bg-ink dark:bg-white rounded-[1px]"></div></>}
                      </div>
                    ))}
                 </div>
                 <div className="text-center relative z-10">
                    <div className="text-lg font-bold font-display text-ink dark:text-white">{tri.name}为{tri.nature}</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 font-serif">属性：{tri.attr}</div>
                 </div>
              </div>
            ))}
          </section>

          {/* Section 3: Philosophical Insight (Great Image / Da Xiang) */}
           <section className="mb-8 p-5 bg-stone-100/50 dark:bg-white/5 rounded-2xl border border-stone-200/50 dark:border-white/5 relative overflow-hidden">
             <div className="absolute top-2 right-3 text-6xl text-ink/5 dark:text-white/5 font-display font-bold pointer-events-none">象</div>
             <h4 className="text-[10px] font-bold text-cinnabar uppercase tracking-widest mb-2 flex items-center gap-2">
                <Icon name="auto_awesome" className="text-[12px]" />
                易理启示 Insight
             </h4>
             <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-serif text-justify">
                《象》曰：{upperTrigram.nature}在{lowerTrigram.nature}{iSAbove(upperTrigram.nature, lowerTrigram.nature)}，{hexagram.name}。
                君子以{getVirtue(hexagram.id)}。
             </p>
             <p className="text-[10px] text-stone-400 mt-3 pt-3 border-t border-stone-200 dark:border-white/10 italic">
                此卦由{upperTrigram.nature}（{upperTrigram.attr}）与{lowerTrigram.nature}（{lowerTrigram.attr}）组成。
                {explainInteraction(upperTrigram, lowerTrigram)}
             </p>
           </section>

          <div className="h-px w-full bg-stone-200 dark:border-white/10 mb-8 flex items-center justify-center">
             <div className="px-4 bg-parchment dark:bg-background-dark text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">爻辞 Interpretation</div>
          </div>

          {/* Section 4: Lines */}
          <section className="pb-6">
            <div className="space-y-6">
              {hexagram.lines.map((lineText, idx) => (
                <div key={idx} className="flex gap-4 group">
                   <div className="shrink-0 pt-1.5 w-8 flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] text-stone-400 font-bold font-serif">{idx === 0 ? '初' : idx === 5 ? '上' : idx + 1}</span>
                      <div className="w-full h-1 flex justify-between">
                         {hexagram.structure[idx] === 1 ? (
                            <div className="w-full h-full bg-stone-800 dark:bg-white rounded-[1px] shadow-sm"></div>
                         ) : (
                            <><div className="w-[42%] h-full bg-stone-800 dark:bg-white rounded-[1px] shadow-sm"></div><div className="w-[42%] h-full bg-stone-800 dark:bg-white rounded-[1px] shadow-sm"></div></>
                         )}
                      </div>
                   </div>
                   <div className="p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 text-sm leading-relaxed text-ink dark:text-stone-200 shadow-sm flex-1 group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                      {lineText}
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="relative z-20 p-4 border-t border-stone-200 dark:border-white/5 bg-white/80 dark:bg-background-dark/90 backdrop-blur-md flex gap-3">
           <button className="flex-1 py-3 rounded-xl bg-cinnabar text-white font-bold tracking-[0.4em] text-xs shadow-xl shadow-cinnabar/20 active:scale-[0.98] transition-all hover:bg-[#b02a2a] flex items-center justify-center gap-2">
              <Icon name="flare" className="text-base" />
              开始测算
           </button>
           <button 
             onClick={onToggleFavorite}
             className={`px-5 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold text-[10px] uppercase tracking-widest ${isFavorite ? 'border-cinnabar bg-cinnabar/5 text-cinnabar' : 'border-stone-300 dark:border-stone-700 text-stone-500 hover:bg-stone-50'}`}
           >
              <Icon name={isFavorite ? 'bookmark' : 'bookmark_border'} filled={isFavorite} className="text-base" />
              {isFavorite ? '已收藏' : '收藏'}
           </button>
        </div>
      </div>
    </div>
  );
};

// Helper for "Great Image" generation
function iSAbove(upper: string, lower: string) {
   return upper === lower ? '兼' : '上';
}

function getVirtue(id: number) {
   // Simulated varied virtues based on ID mod
   const virtues = [
      "自强不息", "厚德载物", "经纶", "果行育德", "饮食宴乐", "作事谋始", "容民畜众", "建万国", 
      "懿文德", "辨上下", "非礼弗履", "遏恶扬善", "施禄及下", "顺德", "多识前言往行", "振民育德"
   ];
   return virtues[id % virtues.length];
}

function explainInteraction(upper: TrigramData, lower: TrigramData) {
   if (upper.nature === lower.nature) {
      return `上下皆为${upper.nature}，象征${upper.attr}之意重叠，力量加倍。`;
   }
   return `${upper.nature}在${lower.nature}之上，${upper.attr}与${lower.attr}相互激荡，形成独特的时势。`;
}
