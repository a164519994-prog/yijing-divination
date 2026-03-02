import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Icon } from '../components/Icon';
import { BACKGROUND_TEXTURE } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

type DocumentType = 'agreement' | 'privacy';

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);

  const handleLoginAction = () => {
    if (!agree) {
      alert('请先阅读并同意用户协议及隐私政策');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1500);
  };

  // Reusable Terms Component
  const TermsCheckbox = () => (
    <div className="flex items-start justify-center gap-2 px-4">
      <button 
        onClick={() => setAgree(!agree)}
        className={`mt-0.5 size-4 rounded border transition-all flex items-center justify-center shrink-0 ${agree ? 'bg-cinnabar border-cinnabar' : 'border-stone-400 bg-transparent'}`}
      >
        {agree && <Icon name="check" className="text-[12px] text-white" />}
      </button>
      <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed text-left max-w-[260px]">
        我已阅读并同意 
        <span 
          onClick={(e) => { e.stopPropagation(); setDocumentType('agreement'); }}
          className="text-ink dark:text-white underline cursor-pointer decoration-stone-300 underline-offset-2 mx-1 hover:text-cinnabar transition-colors"
        >
          用户协议
        </span> 
        与 
        <span 
          onClick={(e) => { e.stopPropagation(); setDocumentType('privacy'); }}
          className="text-ink dark:text-white underline cursor-pointer decoration-stone-300 underline-offset-2 mx-1 hover:text-cinnabar transition-colors"
        >
          隐私政策
        </span>
      </p>
    </div>
  );

  const getDocumentContent = (type: DocumentType) => {
    if (type === 'agreement') {
        return (
            <div className="space-y-4">
                <p><strong>1. 服务条款的确认与接纳</strong><br/>欢迎使用“易境”（以下简称“本应用”）。本应用的所有权和运营权归开发者所有。用户在使用本应用前，应当仔细阅读本协议。用户勾选“同意”即表示完全接受本协议项下的全部条款。</p>
                <p><strong>2. 服务内容</strong><br/>本应用致力于传播中国传统文化，提供基于《周易》的数字化测算体验及国学知识分享。<strong>特别提示：本应用提供的测算结果仅供娱乐和文化探索参考，不具备科学依据，不应作为人生重大决策（如医疗、投资、法律等）的唯一依据。</strong></p>
                <p><strong>3. 用户行为规范</strong><br/>用户在使用本应用过程中，不得发布违反法律法规、社会主义制度、国家利益、公民合法权益、社会公共秩序、道德风尚的信息。</p>
                <p><strong>4. 知识产权</strong><br/>本应用包含的文本、图片、音频、视频、软件代码等内容受版权法保护。未经授权，用户不得进行复制、修改、传播或用于商业用途。</p>
                <p><strong>5. 免责声明</strong><br/>鉴于网络服务的特殊性，本应用不保证服务不会中断，对服务的及时性、安全性、准确性不作担保。对于因不可抗力或黑客攻击等原因造成的服务中断或数据丢失，本应用不承担责任。</p>
            </div>
        );
    } else {
        return (
            <div className="space-y-4">
                <p><strong>1. 信息收集</strong><br/>为了提供更好的测算服务，我们可能会收集您在使用过程中主动输入的测算信息（如求测事项、出生时间等）。这些信息仅用于生成当次测算结果。</p>
                <p><strong>2. 信息使用</strong><br/>我们将使用收集的信息为您提供个性化的文化解读服务。我们承诺不会将您的个人敏感信息出售给第三方。</p>
                <p><strong>3. 第三方服务</strong><br/>本应用可能使用第三方AI服务（如DeepSeek、Google Gemini）来辅助生成解读内容。在此过程中，去标识化的查询文本可能会发送至第三方服务器进行处理，但不会包含您的身份识别信息。</p>
                <p><strong>4. 信息安全</strong><br/>我们采取合理的技术手段保护您的数据安全，防止数据泄露、丢失或被滥用。</p>
                <p><strong>5. 政策更新</strong><br/>我们可能会根据法律法规或业务调整更新本隐私政策，更新后的政策将在本页面发布。</p>
            </div>
        );
    }
  };

  return (
    <Layout showNav={false}>
      <div className="relative w-full h-full overflow-hidden bg-parchment dark:bg-background-dark">
        {/* Fixed Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Global Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-40 mix-blend-multiply dark:mix-blend-overlay" 
            style={{ backgroundImage: `url('${BACKGROUND_TEXTURE}')` }}
          ></div>

          {/* Ink Wash Mountain Background */}
          <div className="absolute bottom-0 left-0 right-0 h-[50vh] opacity-20 dark:opacity-10 mask-gradient-to-t">
             <img 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgBViaJ02KiSlEaHXGh71imd9yRJLcO9bR7vWs5UAichWFu0mVbhyxqOYPynlgl7dflMFiUDT2HquXvYR5PCfo-07MIhpsWl-ippzE-zqJSPecSpW2SNpviJANpw24WaFy587AYVBmOiWp97wPn3GYo5qj60r-C9lPoJ3w0LQO-D1GAxvDzgAe_s7UHy05-J8VXgJ5oGqV_crlq4Tj5aG1U5-59eBkgDaiCxa_MXFcAhhnRpVaqXPk9VoeAAbvifnUE3GSREVii7dm" 
               className="w-full h-full object-cover object-bottom grayscale"
               alt="Ink Mountains"
             />
          </div>

          {/* Decorative Floating Blobs */}
          <div className="absolute top-[-10%] right-[-10%] size-80 bg-cinnabar/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[30%] left-[-20%] size-64 bg-ink/5 dark:bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Scrollable Content Layer */}
        <div className="absolute inset-0 z-10 overflow-y-auto scrollbar-hide">
          <div className="min-h-full flex flex-col px-8 pt-12 pb-10">
            
            {/* Logo Section - Centered Top */}
            <div className="flex-1 flex flex-col items-center justify-center transition-all duration-700 ease-out">
              
              {/* OBSIDIAN BOOK LOGO - 3D & TRANSPARENT BLACK & OPENING ANIMATION */}
              <div className="relative w-36 h-48 mb-8 group [perspective:1000px] cursor-pointer">
                {/* Halo - Mystic Dark/Neutral */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-stone-600/10 dark:bg-white/5 rounded-full blur-[60px] animate-pulse"></div>
                
                {/* Background Rings - Subtle */}
                <div className="absolute -inset-10 rounded-full border border-stone-800/5 dark:border-white/10 border-dashed animate-[spin_60s_linear_infinite] opacity-60"></div>
                <div className="absolute -inset-6 rounded-full border border-stone-800/5 dark:border-white/5 animate-[spin_40s_linear_infinite_reverse] opacity-40"></div>

                {/* Back Page Layer (The 'Inside' content) - Visible when cover opens */}
                <div className="absolute inset-0 bg-[#f0f9f6] dark:bg-[#0c1a15] rounded-r-lg rounded-l-[2px] shadow-sm border border-stone-200/50 dark:border-white/5 flex flex-col justify-center items-center overflow-hidden scale-[0.98] translate-x-[2px] opacity-80 group-hover:opacity-100 transition-opacity">
                    {/* Inner texture */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>
                    {/* Ancient Wisdom Lines - Abstract Text */}
                    <div className="w-2/3 space-y-3 opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen">
                        <div className="h-0.5 bg-ink dark:bg-white rounded-full w-full"></div>
                        <div className="h-0.5 bg-ink dark:bg-white rounded-full w-4/5"></div>
                        <div className="h-0.5 bg-ink dark:bg-white rounded-full w-5/6"></div>
                        <div className="h-0.5 bg-ink dark:bg-white rounded-full w-3/4"></div>
                        <div className="h-0.5 bg-ink dark:bg-white rounded-full w-2/3"></div>
                    </div>
                </div>

                {/* ROTATION WRAPPER: Handles the 3D rotation */}
                <div className="relative w-full h-full transform-gpu transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-left group-hover:[transform:rotateY(-40deg)]">
                    
                    {/* VISUAL COVER: Handles background, overflow, border - SEPARATED to avoid clipping the seal */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden
                              bg-gradient-to-br from-white/10 via-stone-900/60 to-black/80
                              backdrop-blur-[6px] 
                              border border-white/20 dark:border-white/10
                              shadow-[inset_0_0_20px_rgba(0,0,0,0.4),inset_0_0_50px_rgba(255,255,255,0.05),0_15px_35px_-10px_rgba(0,0,0,0.3)]
                              dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.05),inset_0_0_50px_rgba(0,0,0,0.5),0_15px_35px_-10px_rgba(0,0,0,0.5)]">
                        
                        {/* Internal Depth / Refraction simulation */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
                        <div className="absolute -inset-full bg-gradient-to-br from-transparent via-white/5 to-transparent rotate-12 pointer-events-none"></div>

                        {/* Binding (Left Side) - Integrated transparent binding */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/20 border-r border-white/10 flex flex-col justify-between py-8 items-center z-10 backdrop-blur-[2px]">
                            {[1, 2, 3, 4].map(i => (
                               <div key={i} className="w-1 h-1 rounded-full bg-white/20 shadow-inner ring-1 ring-white/20"></div>
                            ))}
                        </div>
                        
                        {/* Center Label Area */}
                        <div className="absolute inset-0 flex items-center justify-center pl-8">
                            <div className="w-20 h-32 border border-white/10 rounded-[1px] flex items-center justify-center relative group-hover:border-white/20 transition-colors">
                                 <div className="absolute inset-x-2 top-2 bottom-2 border-y border-white/5"></div>
                                 <div className="absolute inset-y-2 left-2 right-2 border-x border-white/5"></div>
                                 
                                 {/* Main Character - Frosted Internal Engraving Look */}
                                 {/* Back glow for depth - Dark for obsidian */}
                                 <span className="absolute text-6xl font-display font-bold text-black/40 blur-[1px] select-none translate-y-[1px]">易</span>
                                 {/* Front character - Frosted White/Silver */}
                                 <span className="relative text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] select-none mix-blend-overlay z-20 opacity-90">易</span>
                            </div>
                        </div>

                        {/* Glossy Reflection - Enhanced for glassiness */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-30 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/40 to-transparent opacity-20 blur-2xl group-hover:translate-x-6 transition-transform pointer-events-none"></div>
                    </div>

                    {/* Seal - Attached to Cover - OUTSIDE the overflow-hidden div but INSIDE the rotating div */}
                    <div className="absolute -bottom-2 -right-4 size-10 bg-gradient-to-br from-[#c43636] to-[#7f1d1d] text-white rounded-lg shadow-lg flex items-center justify-center font-serif border border-white/20 ring-1 ring-black/5 rotate-12 group-hover:rotate-6 transition-all duration-500 z-30 shadow-cinnabar/20 backdrop-blur-md mix-blend-normal">
                        <div className="absolute inset-0 border border-white/20 rounded-[4px] m-[2px]"></div>
                        <span className="font-bold text-lg drop-shadow-md text-white opacity-100">境</span>
                    </div>

                </div>
              </div>

              <div className="text-center space-y-3">
                 <h1 className="text-4xl font-bold tracking-[0.5em] font-display ml-4 
                                text-transparent bg-clip-text bg-gradient-to-b from-ink to-stone-500 dark:from-white dark:to-stone-400
                                drop-shadow-[0_2px_3px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
                   易 境
                 </h1>
                 <div className="flex items-center justify-center gap-3 opacity-60">
                    <div className="h-px w-8 bg-stone-400"></div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 tracking-[0.4em] font-serif uppercase">Realm of Changes</p>
                    <div className="h-px w-8 bg-stone-400"></div>
                 </div>
              </div>
            </div>

            {/* Content Section - Bottom Card */}
            <div className="relative flex flex-col justify-center transition-all duration-700 flex-1">
              
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-backwards w-full">
                  <div className="text-center mb-10">
                    {/* Updated Slogan */}
                    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 text-sm sm:text-base whitespace-nowrap">
                      <span className="font-bold text-ink dark:text-white tracking-widest flex items-center">
                        以
                        {/* Cinnabar Text for 'Guo Xue' */}
                        <span className="text-cinnabar text-xl mx-1.5 font-display font-black">国学</span>
                        为灵魂
                      </span>
                      <span className="font-bold text-ink dark:text-white tracking-widest flex items-center">
                        以
                        {/* Royal Blue Text for 'Zhou Yi' */}
                        <span className="text-royal-blue dark:text-blue-400 text-xl mx-1.5 font-display font-black">周易</span>
                        为蓝本
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 font-serif italic opacity-80">
                        孔子以探周易为晚年之道
                      </p>
                      {/* Gray 'Wei Bian San Jue' Seal */}
                      <div className="w-8 h-4 border border-stone-400/80 rounded-[2px] flex items-center justify-center opacity-80">
                          <span className="text-[6px] font-bold text-stone-500 leading-none">韦编<br/>三绝</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={handleLoginAction}
                      disabled={loading}
                      className="w-full h-14 bg-cinnabar text-white rounded-xl shadow-lg shadow-cinnabar/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-[#b02a2a] relative overflow-hidden group border border-transparent"
                    >
                      {loading ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Icon name="explore" className="text-white/90" filled />
                          <span className="text-sm font-bold tracking-[0.2em]">游客直接进入</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-stone-400 text-center tracking-widest">Guest Access Mode</p>
                  </div>

                  <div className="mt-6 mb-4">
                     <TermsCheckbox />
                  </div>
                </div>
              
            </div>
          </div>
        </div>

        {/* Document Modal */}
        {documentType && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setDocumentType(null)}></div>
                <div className="relative w-full max-w-sm h-[70vh] bg-parchment dark:bg-background-dark rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-white/10 animate-in zoom-in-95 duration-300">
                    <div className="flex-none p-4 border-b border-stone-200 dark:border-white/10 flex justify-between items-center bg-stone-50/50 dark:bg-white/5">
                        <h3 className="text-sm font-bold tracking-widest text-ink dark:text-white">
                            {documentType === 'agreement' ? '用户协议' : '隐私政策'}
                        </h3>
                        <button onClick={() => setDocumentType(null)} className="size-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                            <Icon name="close" className="text-lg" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans text-justify scrollbar-hide">
                        {getDocumentContent(documentType)}
                    </div>
                    <div className="flex-none p-4 bg-stone-50 dark:bg-white/5 flex justify-center border-t border-stone-200 dark:border-white/10">
                        <button 
                            onClick={() => setDocumentType(null)}
                            className="w-full py-2.5 rounded-xl bg-cinnabar text-white font-bold tracking-widest text-xs shadow-md active:scale-95 transition-all"
                        >
                            我已阅读并知晓
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};