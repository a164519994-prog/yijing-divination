import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { Icon } from '../components/Icon';
import { HEXAGRAMS, DIVINATION_TOPICS, BACKGROUND_TEXTURE } from '../constants';
import { DivinationRecord, Hexagram, DivinationContext } from '../types';

interface ProfileProps {
  onLogout: () => void;
}

interface MenuButtonProps {
  icon: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  hasArrow?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, title, subtitle, onClick, hasArrow }) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-white/50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all active:scale-95 group relative overflow-hidden"
    >
      <div className="size-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-500 dark:text-stone-400 mb-3 group-hover:bg-cinnabar group-hover:text-white transition-colors">
        <Icon name={icon} className="text-lg" />
      </div>
      <div className="text-left z-10 relative">
         <h3 className="text-sm font-bold text-ink dark:text-white">{title}</h3>
         <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-0.5 font-serif">{subtitle}</p>
      </div>
      {hasArrow && (
         <div className="absolute top-4 right-4 text-stone-300 dark:text-stone-600 group-hover:translate-x-1 transition-transform">
           <Icon name="arrow_forward" className="text-xs" />
         </div>
      )}
    </button>
  );
};

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const [showMarks, setShowMarks] = useState(false);
  const [showContact, setShowContact] = useState(false); // New State for Contact Modal
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState<DivinationRecord[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // New State for Marks Detail
  const [selectedMark, setSelectedMark] = useState<any | null>(null);

  // Settings States
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSyncEnabled, setDataSyncEnabled] = useState(true);

  // Persona State
  const [isMale, setIsMale] = useState(true);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: '君子君',
    title: 'GENTLEMAN SCHOLAR',
    bio: '诚心正意，感而遂通。探索易经智慧，寻找内心宁静。',
    gender: '男',
    badge: '君',
    region: '北京',
    birthday: '1995-05-20',
    constellation: '金牛座'
  });

  // Load state from local storage
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    const savedHistory = localStorage.getItem('divination_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
    const savedFavs = localStorage.getItem('divination_favorites');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
    }
    
    // Load Gender Persona
    const savedGender = localStorage.getItem('profile_gender');
    if (savedGender === 'female') {
       setIsMale(false);
       setProfileData(prev => ({
          ...prev,
          name: '淑女君',
          title: 'ELEGANT SCHOLAR',
          bio: '上善若水，厚德载物。以柔克刚，在易理中修养身心。',
          gender: '女',
          badge: '淑'
       }));
    }
  }, []);

  // Sync favorites whenever they change
  useEffect(() => {
    localStorage.setItem('divination_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const togglePersona = () => {
     const nextIsMale = !isMale;
     setIsMale(nextIsMale);
     localStorage.setItem('profile_gender', nextIsMale ? 'male' : 'female');
     
     setProfileData(prev => ({
        ...prev,
        name: nextIsMale ? '君子君' : '淑女君',
        title: nextIsMale ? 'GENTLEMAN SCHOLAR' : 'ELEGANT SCHOLAR',
        bio: nextIsMale ? '诚心正意，感而遂通。探索易经智慧，寻找内心宁静。' : '上善若水，厚德载物。以柔克刚，在易理中修养身心。',
        badge: nextIsMale ? '君' : '淑',
        gender: nextIsMale ? '男' : '女'
     }));
  };

  // Calculations for Learning Progress
  const learningStats = useMemo(() => {
     // Get unique hexagrams encountered in history
     const uniqueHexagrams = new Set(history.map(r => r.hexagramId));
     const count = uniqueHexagrams.size;
     const total = 64;
     const percentage = Math.min(100, Math.round((count / total) * 100));
     
     // Calculate "Days of Study" (rough approximation based on first record)
     let days = 1;
     if (history.length > 0) {
        const firstDate = new Date(history[history.length - 1].timestamp);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - firstDate.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
     }

     // Determine "Realm" / Level
     let realm = "初窥门径";
     let realmEn = "Novice";
     let nextRealm = "渐入佳境";
     let nextTarget = 10;

     if (count >= 10) { realm = "渐入佳境"; realmEn = "Apprentice"; nextRealm = "登堂入室"; nextTarget = 30; }
     if (count >= 30) { realm = "登堂入室"; realmEn = "Adept"; nextRealm = "融会贯通"; nextTarget = 50; }
     if (count >= 50) { realm = "融会贯通"; realmEn = "Master"; nextRealm = "天人合一"; nextTarget = 64; }
     if (count >= 64) { realm = "天人合一"; realmEn = "Sage"; nextRealm = "圆满"; nextTarget = 64; }

     return { count, total, percentage, days, realm, realmEn, nextRealm, nextTarget };
  }, [history]);

  // Calculations for Cultural Marks (Achievements)
  const marks = useMemo(() => {
    return [
      {
        id: 'beginner',
        name: '问道',
        enName: 'Seeker',
        icon: 'explore',
        condition: '完成第一次诚心起卦',
        poetic: '路漫漫其修远兮，吾将上下而求索。',
        unlocked: history.length > 0
      },
      {
        id: 'keeper',
        name: '藏经',
        enName: 'Keeper',
        icon: 'book',
        condition: '收藏任意一个卦象',
        poetic: '知其雄，守其雌，为天下溪。',
        unlocked: favorites.length > 0
      },
      {
        id: 'reflection',
        name: '三省',
        enName: 'Reflect',
        icon: 'self_improvement',
        condition: '累计进行 3 次测算',
        poetic: '吾日三省吾身：为人谋而不忠乎？',
        unlocked: history.length >= 3
      },
      {
        id: 'insight',
        name: '通幽',
        enName: 'Insight',
        icon: 'psychology',
        condition: '累计进行 10 次测算',
        poetic: '知几其神乎！君子上交不谄，下交不渎。',
        unlocked: history.length >= 10
      },
      {
        id: 'collector',
        name: '集萃',
        enName: 'Collector',
        icon: 'collections_bookmark',
        condition: '累计收藏 5 个卦象',
        poetic: '博学而笃志，切问而近思，仁在其中矣。',
        unlocked: favorites.length >= 5
      },
      {
        id: 'master',
        name: '知命',
        enName: 'Destiny',
        icon: 'all_inclusive',
        condition: '解锁全部 64 个卦象',
        poetic: '乐天知命，故不忧。安土敦乎仁，故能爱。',
        unlocked: learningStats.count >= 64
      }
    ];
  }, [history, favorites, learningStats]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setShowSettings(false);
    onLogout();
  };

  const clearHistory = () => {
    if (window.confirm('确定要清空所有测算记录吗？此操作不可恢复。')) {
      setHistory([]);
      localStorage.removeItem('divination_history');
    }
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  // Helper for toggle switch UI
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${checked ? 'bg-cinnabar' : 'bg-stone-300 dark:bg-stone-600'}`}
    >
      <div className={`absolute top-1 size-3 rounded-full bg-white shadow-sm transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`}></div>
    </button>
  );

  return (
    <Layout>
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {/* Header Background */}
        <div className="absolute top-0 left-0 right-0 h-[400px] z-0 overflow-hidden pointer-events-none mask-gradient-to-b">
          <img alt="Ink Mountains" className="w-full h-full object-cover opacity-30 mix-blend-darken dark:opacity-40 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgBViaJ02KiSlEaHXGh71imd9yRJLcO9bR7vWs5UAichWFu0mVbhyxqOYPynlgl7dflMFiUDT2HquXvYR5PCfo-07MIhpsWl-ippzE-zqJSPecSpW2SNpviJANpw24WaFy587AYVBmOiWp97wPn3GYo5qj60r-C9lPoJ3w0LQO-D1GAxvDzgAe_s7UHy05-J8VXgJ5oGqV_crlq4Tj5aG1U5-59eBkgDaiCxa_MXFcAhhnRpVaqXPk9VoeAAbvifnUE3GSREVii7dm" />
        </div>

        <header className="relative z-20 flex items-center justify-between px-6 pt-6 pb-2">
          <div className="size-10"></div> 
          <h1 className="text-base font-bold tracking-widest text-ink dark:text-white opacity-90 text-center flex flex-col items-center leading-tight">
            <span>个人中心</span>
            <span className="text-[10px] font-normal tracking-wide opacity-80 mt-0.5">Profile</span>
          </h1>
          <button onClick={() => setShowSettings(true)} className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-ink dark:text-white">
            <Icon name="settings" className="text-[24px]" />
          </button>
        </header>

        <main className="relative z-10 flex-1 flex flex-col overflow-y-auto pb-8 scrollbar-hide">
          <div className="flex flex-col items-center justify-center pt-8 pb-10 relative">
            <div 
              className="relative size-28 mb-4 group cursor-pointer"
              onClick={togglePersona}
            >
              <div className="absolute -inset-2 rounded-full border border-stone-800/10 dark:border-white/10 opacity-60 animate-[spin_10s_linear_infinite]"></div>
              <div className={`relative size-full rounded-full overflow-hidden border-2 shadow-xl transition-all duration-500 ${isMale ? 'border-stone-100 dark:border-stone-700' : 'border-rose-100 dark:border-rose-900/30'}`}>
                {/* 
                  Using the male vector image for both to maintain the strict flat illustration style.
                  For the 'Lady', we flip it horizontally. 
                */}
                <img 
                  alt="Profile" 
                  className={`w-full h-full object-cover transition-all duration-700 ${isMale ? '' : 'scale-x-[-1] brightness-105'}`} 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJXLkFsvPoLaxKPLCiWc2ATdI2y3usZewNwor2jN2pmwreaj8eyDP0IbxCrlt106b9L1bXxSTdSZfjVf2MHpXgO88cS0-DU4QYvcMMMNYI6A2iYCvgo1qXWJa2pzaB192X8dxS7Nhy-Z9lMyvX3G006JSS68gRt16zO37-caIXHRE7eJnilQWKq3AFT76eWVPMx98WHpbSu3fiz3MwprYa07oMFDu7CZ41eLXQcp120t7kYH9dmOaBUiq6dkYxnQvFir9a94ge7L9g"
                />
                {/* Switch hint overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <Icon name="cached" className="text-white text-2xl" />
                </div>
              </div>
              
              <div className={`absolute -bottom-1 -right-1 size-8 rounded-md shadow-lg flex items-center justify-center rotate-12 text-white border border-white/20 text-[10px] font-serif transition-colors duration-500 ${isMale ? 'bg-cinnabar' : 'bg-rose-400'}`}>
                 <span key={profileData.badge} className="animate-in zoom-in duration-300">{profileData.badge}</span>
              </div>
            </div>
            
            <h2 key={profileData.name} className="text-2xl font-bold text-ink dark:text-white mb-1 animate-in fade-in duration-500">{profileData.name}</h2>
            <p key={profileData.title} className="text-xs font-serif italic text-stone-500 dark:text-stone-400 tracking-widest uppercase animate-in fade-in duration-500">{profileData.title}</p>
          </div>

          <div className="px-5 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <MenuButton icon="history_edu" title="测算记录" subtitle="Records" hasArrow onClick={() => setShowHistory(true)} />
              <MenuButton icon="auto_graph" title="学习进度" subtitle="Learning" hasArrow onClick={() => setShowLearning(true)} />
              <MenuButton icon="bookmark" title="我的收藏" subtitle="Favorites" onClick={() => setShowFavorites(true)} />
              <MenuButton icon="fingerprint" title="文化印记" subtitle="Marks" onClick={() => setShowMarks(true)} />
            </div>
          </div>

          {/* New Minimal Artistic Card - Redesigned Spiritual Growth */}
          <div className="px-5 pb-8">
            <div 
              onClick={() => setShowContact(true)}
              className="relative w-full h-32 rounded-[24px] overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl shadow-sm bg-white dark:bg-white/5 border border-stone-100 dark:border-white/5"
            >
              
              {/* Texture & Light */}
              <div className="absolute inset-0 opacity-40 mix-blend-multiply dark:mix-blend-overlay" style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>

              {/* Content Container */}
              <div className="relative h-full flex items-center justify-between px-8 z-10">
                 
                 {/* Title: Minimal & Elegant */}
                 <div className="flex flex-col justify-center">
                    <h3 className="text-2xl font-bold font-display text-ink dark:text-white tracking-[0.2em] drop-shadow-sm group-hover:text-cinnabar transition-colors duration-500">
                       心灵成长
                    </h3>
                    <div className="flex items-center gap-2 mt-2 opacity-60 group-hover:opacity-80 transition-opacity">
                       <span className="h-px w-8 bg-stone-300 dark:bg-stone-600"></span>
                       <span className="text-[9px] font-serif uppercase tracking-widest text-stone-500 dark:text-stone-400">Zen Wisdom</span>
                    </div>
                 </div>

                 {/* The Object: "Zen Stone" - Created via Hotlinked Image Mask */}
                 <div className="relative size-20 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                     {/* Shadow */}
                     <div className="absolute -bottom-2 w-16 h-4 bg-stone-900/10 rounded-[100%] blur-sm group-hover:scale-110 transition-transform duration-700"></div>
                     
                     {/* The Stone Object */}
                     <div className="relative w-full h-full">
                        {/* The Ink Texture Image clipped to a Stone Shape */}
                        <div className="w-full h-full rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] overflow-hidden relative shadow-inner ring-1 ring-black/5 rotate-12">
                            <img 
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgBViaJ02KiSlEaHXGh71imd9yRJLcO9bR7vWs5UAichWFu0mVbhyxqOYPynlgl7dflMFiUDT2HquXvYR5PCfo-07MIhpsWl-ippzE-zqJSPecSpW2SNpviJANpw24WaFy587AYVBmOiWp97wPn3GYo5qj60r-C9lPoJ3w0LQO-D1GAxvDzgAe_s7UHy05-J8VXgJ5oGqV_crlq4Tj5aG1U5-59eBkgDaiCxa_MXFcAhhnRpVaqXPk9VoeAAbvifnUE3GSREVii7dm" 
                              alt="Zen Stone Texture"
                              className="w-[150%] h-[150%] object-cover object-center grayscale contrast-125 opacity-80"
                            />
                            {/* Inner Highlight for 3D effect */}
                            <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/60 via-transparent to-black/20 pointer-events-none mix-blend-overlay"></div>
                        </div>
                     </div>
                 </div>

              </div>
            </div>
          </div>

        </main>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-w-sm h-[85vh] bg-parchment dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in slide-in-from-bottom duration-300">
             <div className="flex-none p-5 border-b border-stone-200 dark:border-white/10 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
                <h3 className="text-sm font-bold tracking-[0.2em] text-ink dark:text-white uppercase">测算记录 History</h3>
                <div className="flex gap-2">
                   {history.length > 0 && (
                      <button onClick={clearHistory} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-stone-400 hover:text-cinnabar">
                         <Icon name="delete" className="text-lg" />
                      </button>
                   )}
                   <button onClick={() => setShowHistory(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                      <Icon name="close" />
                   </button>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                {history.length > 0 ? (
                   <div className="space-y-3">
                      {history.map((record) => {
                         const hex = HEXAGRAMS.find(h => h.id === record.hexagramId);
                         const topic = DIVINATION_TOPICS.find(t => t.id === record.topicId);
                         const dateObj = new Date(record.timestamp);
                         return (
                            <div key={record.id} className="bg-white/50 dark:bg-white/5 border border-stone-100 dark:border-white/5 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                               <div className="size-10 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center shrink-0 text-stone-500">
                                  <Icon name={topic?.icon || 'help'} />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline mb-1">
                                     <h4 className="font-bold text-ink dark:text-white text-sm truncate">{hex?.name}</h4>
                                     <span className="text-[10px] text-stone-400 font-serif">{dateObj.toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate opacity-80">{record.query || "心中所惑"}</p>
                               </div>
                            </div>
                         );
                      })}
                   </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
                      <Icon name="history_edu" className="text-5xl" />
                      <p className="text-xs font-bold tracking-widest uppercase">暂无记录</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowFavorites(false)}></div>
          <div className="relative w-full max-w-sm h-[85vh] bg-parchment dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in slide-in-from-bottom duration-300">
             <div className="flex-none p-5 border-b border-stone-200 dark:border-white/10 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
                <h3 className="text-sm font-bold tracking-[0.2em] text-ink dark:text-white uppercase">我的收藏 Favorites</h3>
                <button onClick={() => setShowFavorites(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                   <Icon name="close" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                {favorites.length > 0 ? (
                   <div className="grid grid-cols-1 gap-3">
                      {favorites.map((favId) => {
                         const hex = HEXAGRAMS.find(h => h.id === favId);
                         if (!hex) return null;
                         return (
                            <div key={favId} className="bg-white/60 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 rounded-xl p-4 flex gap-4 shadow-sm relative group">
                               <div className="flex flex-col gap-[2px] w-6 shrink-0 py-1 opacity-60">
                                  {[...hex.structure].reverse().map((line, idx) => (
                                     <div key={idx} className="flex justify-between w-full h-[3px]">
                                        {line === 1 ? <div className="w-full h-full bg-stone-800 dark:bg-white rounded-[1px]"></div> : <><div className="w-[40%] h-full bg-stone-800 dark:bg-white rounded-[1px]"></div><div className="w-[40%] h-full bg-stone-800 dark:bg-white rounded-[1px]"></div></>}
                                     </div>
                                  ))}
                               </div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                     <h4 className="font-bold text-ink dark:text-white text-base font-display">{hex.name}</h4>
                                     <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-stone-500 font-bold">{hex.tag}</span>
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{hex.judgment}</p>
                               </div>
                               <button 
                                 onClick={() => removeFavorite(favId)}
                                 className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-cinnabar"
                               >
                                  <Icon name="remove_circle_outline" className="text-lg" />
                               </button>
                            </div>
                         );
                      })}
                   </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3">
                      <Icon name="bookmark_border" className="text-5xl" />
                      <p className="text-xs font-bold tracking-widest uppercase">暂无收藏</p>
                   </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Learning Progress Modal */}
      {showLearning && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowLearning(false)}></div>
          <div className="relative w-full max-w-sm h-[85vh] bg-parchment dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in slide-in-from-bottom duration-300">
             <div className="flex-none p-5 border-b border-stone-200 dark:border-white/10 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
                <h3 className="text-sm font-bold tracking-[0.2em] text-ink dark:text-white uppercase">学习进度 Progress</h3>
                <button onClick={() => setShowLearning(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                   <Icon name="close" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="flex flex-col items-center mb-8">
                   <div className="relative size-40 mb-6">
                      <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                         <path className="text-stone-200 dark:text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                         <path className="text-cinnabar transition-all duration-1000 ease-out" strokeDasharray={`${learningStats.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-3xl font-display font-bold text-ink dark:text-white">{learningStats.count}</span>
                         <span className="text-[10px] text-stone-400 uppercase tracking-widest">/ 64 卦</span>
                      </div>
                   </div>
                   <h2 className="text-xl font-bold font-display text-ink dark:text-white mb-1">{learningStats.realm}</h2>
                   <p className="text-xs text-stone-500 uppercase tracking-widest">{learningStats.realmEn}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 text-center border border-stone-100 dark:border-white/5">
                      <div className="text-2xl font-bold text-ink dark:text-white mb-1 font-display">{learningStats.days}</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest">坚持天数 Days</div>
                   </div>
                   <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 text-center border border-stone-100 dark:border-white/5">
                      <div className="text-2xl font-bold text-ink dark:text-white mb-1 font-display">{learningStats.percentage}%</div>
                      <div className="text-[10px] text-stone-400 uppercase tracking-widest">解锁进度 Rate</div>
                   </div>
                </div>
                
                <div className="mt-6 p-4 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200/50 dark:border-white/5">
                   <h4 className="text-xs font-bold text-stone-600 dark:text-stone-300 mb-2">下个境界：{learningStats.nextRealm}</h4>
                   <div className="w-full h-1.5 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-400 dark:bg-white/30 rounded-full" style={{ width: `${(learningStats.count / learningStats.nextTarget) * 100}%` }}></div>
                   </div>
                   <p className="text-[10px] text-stone-400 mt-2 text-right">还需解锁 {Math.max(0, learningStats.nextTarget - learningStats.count)} 个卦象</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Cultural Marks Modal (UPDATED) */}
      {showMarks && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowMarks(false)}></div>
          <div className="relative w-full max-w-sm h-[85vh] bg-parchment dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in slide-in-from-bottom duration-300">
             
             {/* Header */}
             <div className="flex-none p-5 border-b border-stone-200 dark:border-white/10 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
                <h3 className="text-sm font-bold tracking-[0.2em] text-ink dark:text-white uppercase">文化印记 Marks</h3>
                <button onClick={() => setShowMarks(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                   <Icon name="close" />
                </button>
             </div>

             {/* Seal Grid */}
             <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 text-center font-serif leading-relaxed px-4">
                  “凡走过必留下痕迹。”<br/>收集您的修习印记，点亮易学之路。
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {marks.map((mark) => (
                    <button 
                      key={mark.id}
                      onClick={() => setSelectedMark(mark)}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative group transition-all duration-300 ${mark.unlocked ? 'bg-cinnabar/5 dark:bg-cinnabar/10 border-[3px] border-cinnabar/80 hover:bg-cinnabar/10 shadow-sm' : 'bg-stone-100 dark:bg-white/5 border border-dashed border-stone-300 dark:border-stone-700 opacity-60 hover:opacity-100'}`}
                    >
                       <div className={`text-2xl mb-1 transition-transform group-hover:scale-110 ${mark.unlocked ? 'text-cinnabar drop-shadow-sm' : 'text-stone-300 dark:text-stone-600 grayscale'}`}>
                          <Icon name={mark.icon} filled={mark.unlocked} />
                       </div>
                       <div className={`w-8 h-[1px] mb-1 ${mark.unlocked ? 'bg-cinnabar/30' : 'bg-stone-300/30'}`}></div>
                       <span className={`text-[10px] font-bold font-display tracking-[0.2em] ${mark.unlocked ? 'text-cinnabar' : 'text-stone-400'}`}>
                          {mark.name}
                       </span>
                       
                       {/* Lock Icon for locked items */}
                       {!mark.unlocked && (
                          <div className="absolute top-2 right-2 text-stone-300">
                             <Icon name="lock" className="text-[10px]" />
                          </div>
                       )}
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* Mark Detail Popup (Inner Modal) */}
          {selectedMark && (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedMark(null)}>
               <div 
                 className="w-full bg-parchment dark:bg-stone-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden border border-stone-200 dark:border-white/10 animate-in zoom-in-95 duration-300" 
                 onClick={e => e.stopPropagation()}
               >
                  {/* Texture */}
                  <div className="absolute inset-0 opacity-20 mix-blend-multiply dark:mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}></div>
                  
                  {/* Close Btn */}
                  <button onClick={() => setSelectedMark(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                     <Icon name="close" />
                  </button>

                  <div className="flex flex-col items-center text-center relative z-10">
                     {/* The Giant Seal */}
                     <div className={`size-32 rounded-xl border-4 flex items-center justify-center mb-6 shadow-xl transition-all duration-700 ${selectedMark.unlocked ? 'border-cinnabar bg-cinnabar/5 text-cinnabar rotate-3 animate-in zoom-in spin-in-3 duration-500' : 'border-stone-300 bg-stone-100 text-stone-300 grayscale'}`}>
                        <div className="absolute inset-2 border border-dashed border-current opacity-30 rounded-lg"></div>
                        <div className="flex flex-col items-center justify-center gap-2">
                           <Icon name={selectedMark.icon} className="text-5xl drop-shadow-sm" filled={selectedMark.unlocked} />
                           <span className="font-display font-bold text-lg tracking-[0.4em] writing-vertical-rl h-12 border-l border-current pl-2 ml-1">{selectedMark.name}</span>
                        </div>
                     </div>
                     
                     <h3 className="text-xl font-bold font-display text-ink dark:text-white mb-2">{selectedMark.unlocked ? selectedMark.name : '未解锁'}</h3>
                     <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-4 font-serif">{selectedMark.enName}</p>
                     
                     <div className="w-full h-px bg-stone-200 dark:bg-white/10 mb-4"></div>

                     <p className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">{selectedMark.condition}</p>
                     <p className="text-xs text-stone-500 dark:text-stone-500 italic font-serif">
                       "{selectedMark.poetic}"
                     </p>

                     {selectedMark.unlocked ? (
                        <div className="mt-6 px-4 py-1.5 bg-cinnabar/10 text-cinnabar rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1">
                           <Icon name="verified" className="text-sm" />
                           <span>已点亮 · Collected</span>
                        </div>
                     ) : (
                        <div className="mt-6 px-4 py-1.5 bg-stone-100 dark:bg-white/5 text-stone-400 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1">
                           <Icon name="lock" className="text-sm" />
                           <span>继续修习以解锁</span>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* NEW: Developer Contact Modal (Updated to match minimal design request) */}
      {showContact && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowContact(false)}></div>
           
           {/* Main Card */}
           <div className="relative w-full max-w-[300px] bg-[#fcfaf5] dark:bg-[#1a1d2d] rounded-[24px] shadow-2xl overflow-hidden border border-stone-100 dark:border-white/10 animate-in zoom-in-95 duration-500">
              
              {/* Decorative Background at top */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-stone-200/50 via-stone-100/20 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
              
              {/* Texture Overlay */}
              <div className="absolute inset-0 opacity-20 mix-blend-multiply dark:mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}></div>

              <div className="relative p-8 flex flex-col items-center">
                  
                  {/* Close Button */}
                   <button onClick={() => setShowContact(false)} className="absolute top-3 right-3 text-stone-300 hover:text-stone-500 transition-colors z-20 size-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-white/5">
                      <Icon name="close" className="text-lg" />
                   </button>

                  {/* Avatar Area - Developer Avatar */}
                  <div className="relative mb-6 group cursor-pointer">
                     {/* Glow */}
                     <div className="absolute inset-0 bg-stone-200/50 dark:bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                     
                     {/* The Avatar Container */}
                     <div className="relative size-24 rounded-full bg-[#fcfaf5] dark:bg-[#1a1d2d] shadow-2xl ring-4 ring-white dark:ring-white/5 flex items-center justify-center z-10 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                        {/* Paper Texture */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>
                        
                        {/* Decorative Inner Ring */}
                        <div className="absolute inset-1 rounded-full border border-stone-800/10 dark:border-white/10"></div>
                        
                        {/* Center Icon - Developer (Laptop) */}
                        <Icon name="laptop_mac" className="text-4xl text-ink dark:text-white opacity-80 group-hover:opacity-100 transition-opacity" />

                        {/* Badge - Code */}
                        <div className="absolute bottom-0 right-0 size-8 bg-white dark:bg-stone-700 text-stone-400 dark:text-stone-300 rounded-full flex items-center justify-center ring-4 ring-[#fcfaf5] dark:ring-[#1a1d2d] shadow-sm z-20">
                           <Icon name="code" className="text-[14px]" />
                        </div>
                     </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold font-display text-ink dark:text-white mb-2 tracking-[0.2em] ml-1">清 明</h2>
                      <div className="h-px w-12 bg-stone-200 dark:bg-white/10 mx-auto mb-2"></div>
                      <p className="text-[9px] text-stone-400 uppercase tracking-[0.25em] font-serif">Independent Developer</p>
                  </div>

                  {/* Contact Box */}
                  <div className="w-full relative group cursor-pointer mb-8" onClick={() => {
                        navigator.clipboard.writeText('164519994@qq.com');
                        const btn = document.getElementById('copy-feedback');
                        if(btn) { 
                           const original = btn.innerHTML;
                           btn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span>';
                           setTimeout(() => { btn.innerHTML = original; }, 1500);
                        }
                  }}>
                     <div className="relative bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl p-3 flex items-center justify-between shadow-sm transition-all active:scale-[0.98] hover:border-cinnabar/30">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className="size-8 rounded-lg bg-stone-50 dark:bg-white/10 flex items-center justify-center text-stone-400 shrink-0">
                              <Icon name="mail" className="text-sm" />
                           </div>
                           <div className="flex flex-col items-start min-w-0">
                              <span className="text-[8px] text-stone-400 uppercase tracking-wider font-bold mb-0.5">Email</span>
                              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 font-mono tracking-wide truncate">164519994@qq.com</span>
                           </div>
                        </div>
                        <div 
                          id="copy-feedback"
                          className="size-8 flex items-center justify-center rounded-full text-stone-300 group-hover:text-cinnabar transition-colors"
                        >
                           <Icon name="content_copy" className="text-sm" />
                        </div>
                     </div>
                  </div>

                  {/* Footer Quote */}
                  <div className="text-center opacity-60">
                      <p className="text-[10px] font-serif text-stone-500 dark:text-stone-400 italic">
                         "码海无涯，以梦为马"
                      </p>
                  </div>
              </div>
           </div>
         </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
          <div className="relative w-full max-w-sm bg-parchment dark:bg-background-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85vh]">
             
             {/* Modal Header */}
             <div className="flex-none p-5 border-b border-stone-200 dark:border-white/10 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
                <h3 className="text-sm font-bold tracking-[0.2em] text-ink dark:text-white uppercase">系统设置 Settings</h3>
                <button onClick={() => setShowSettings(false)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                   <Icon name="close" />
                </button>
             </div>

             {/* Modal Body */}
             <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                
                {/* Section: General */}
                <div className="mb-6">
                   <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 pl-2">General · 通用</h4>
                   <div className="bg-white/50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5 overflow-hidden">
                      {/* Theme */}
                      <div className="w-full p-4 flex justify-between items-center hover:bg-white dark:hover:bg-white/10 transition-colors border-b border-stone-100 dark:border-white/5">
                         <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-500"><Icon name="contrast" /></div>
                            <div className="text-left">
                               <div className="text-sm font-bold text-ink dark:text-white">深色模式</div>
                               <div className="text-[10px] text-stone-400">Dark Theme</div>
                            </div>
                         </div>
                         <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} />
                      </div>
                      
                      {/* Push Notifications */}
                      <div className="w-full p-4 flex justify-between items-center hover:bg-white dark:hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-500"><Icon name="notifications" /></div>
                            <div className="text-left">
                               <div className="text-sm font-bold text-ink dark:text-white">推送通知</div>
                               <div className="text-[10px] text-stone-400">Push Notifications</div>
                            </div>
                         </div>
                         <ToggleSwitch checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                      </div>
                   </div>
                </div>

                {/* Section: Data & Sync */}
                <div className="mb-6">
                   <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 pl-2">Data · 数据</h4>
                   <div className="bg-white/50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5 overflow-hidden">
                      <div className="w-full p-4 flex justify-between items-center border-b border-stone-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-500"><Icon name="cloud_sync" /></div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-ink dark:text-white">数据同步</div>
                                <div className="text-[10px] text-stone-400">Cloud Sync</div>
                            </div>
                         </div>
                         <ToggleSwitch checked={dataSyncEnabled} onChange={() => setDataSyncEnabled(!dataSyncEnabled)} />
                      </div>
                      <button className="w-full p-4 flex justify-between items-center hover:bg-white dark:hover:bg-white/10 transition-colors group">
                         <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center text-stone-500 group-hover:text-cinnabar transition-colors"><Icon name="delete_outline" /></div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-ink dark:text-white group-hover:text-cinnabar transition-colors">清除缓存</div>
                                <div className="text-[10px] text-stone-400">Clear Cache</div>
                            </div>
                         </div>
                         <span className="text-[10px] font-bold text-stone-400">24.5 MB</span>
                      </button>
                   </div>
                </div>

                {/* Section: Account */}
                <div>
                   <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 pl-2">Account · 账户</h4>
                   <div className="bg-white/50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5 overflow-hidden">
                      <button onClick={() => setShowLogoutConfirm(true)} className="w-full p-4 flex justify-between items-center hover:bg-cinnabar/5 transition-colors group">
                         <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-cinnabar/10 flex items-center justify-center text-cinnabar"><Icon name="logout" /></div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-cinnabar">退出登录</div>
                                <div className="text-[10px] text-cinnabar/60">Log Out</div>
                            </div>
                         </div>
                         <Icon name="chevron_right" className="text-stone-300 group-hover:text-cinnabar transition-colors" />
                      </button>
                   </div>
                </div>

             </div>

             <div className="p-4 bg-stone-50 dark:bg-white/5 text-center border-t border-stone-200 dark:border-white/10">
                <p className="text-[9px] text-stone-400 font-serif tracking-[0.2em] uppercase">Version 1.2.2 · Build 20240522</p>
             </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="relative w-full max-w-[300px] bg-parchment dark:bg-background-dark rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 border border-stone-200 dark:border-white/10">
             <div className="size-16 bg-cinnabar/10 rounded-full flex items-center justify-center mx-auto mb-6"><Icon name="logout" className="text-cinnabar text-4xl" /></div>
             <h3 className="text-lg font-bold mb-2">确认退出登录？</h3>
             <p className="text-xs text-stone-500 leading-relaxed mb-8">退出后您将需要重新验证以同步数据。</p>
             <div className="flex flex-col gap-2">
                <button onClick={handleLogout} className="w-full py-3.5 bg-cinnabar text-white rounded-xl font-bold tracking-widest shadow-lg shadow-cinnabar/20 active:scale-95 transition-all">确认退出</button>
                <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-3.5 border border-stone-200 dark:border-white/10 text-stone-500 rounded-xl font-bold tracking-widest hover:bg-stone-50 transition-all">暂不退出</button>
             </div>
          </div>
        </div>
      )}
    </Layout>
  );
};