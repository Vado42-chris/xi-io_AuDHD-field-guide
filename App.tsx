import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Page, ComprehensiveResult, JournalEntry, SensorySettings, HistoryPoint, EnvironmentData, SyncPacket } from './types.ts';
import { ALL_QUESTIONS, SPOON_COSTS as INITIAL_SPOON_COSTS, ARTICLES } from './constants.ts';
import { analyzePatterns, getHistoryTrend } from './services/hallbergMath.ts';
import { geminiService, MessagePart, ChatHistoryItem } from './services/geminiService.ts';

/**
 * THREAD & GROUP TYPES
 */
interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  id: string;
  urls?: {title: string, uri: string}[];
  attachment?: string;
  parts?: MessagePart[]; 
}

interface ChatGroup {
  id: string;
  name: string;
  timestamp: number;
}

interface ChatThread {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
  groupId: string; 
}

/**
 * UTILITY: Markdown-Lite Renderer
 */
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        if (line.trim() === '---' || line.trim() === '*') return <hr key={i} className="border-white/5 my-6" />;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-[#4DB6AC] mt-6 mb-3">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-[#4DB6AC] mt-8 mb-4">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-[#4DB6AC] mt-10 mb-6">{line.replace('# ', '')}</h1>;
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          return <li key={i} className="ml-6 list-disc text-white/80 pl-2">{line.trim().substring(2)}</li>;
        }
        if (/^\d+\./.test(line.trim())) {
          return <li key={i} className="ml-6 list-decimal text-white/80 pl-2">{line.trim().substring(line.indexOf('.') + 1).trim()}</li>;
        }
        const formatted = line
          .replace(/\*\*(.*?)\*\*/g, '<b class="text-[#4DB6AC]">$1</b>')
          .replace(/\*(.*?)\*/g, '<i class="text-white/60">$1</i>')
          .replace(/`(.*?)`/g, '<code class="bg-black/40 px-1 rounded text-[#A7FFEB]">$1</code>');
        return <p key={i} className="text-sm leading-relaxed text-white/80" dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} />;
      })}
    </div>
  );
};

/**
 * REUSABLE COMPONENTS
 */
const MetaLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`text-[9px] font-black tracking-[0.25em] uppercase text-[#4DB6AC] mb-2 leading-none ${className}`}>{children}</div>
);

const Panel: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`xi-panel p-8 ${className} ${onClick ? 'cursor-pointer' : ''}`}>{children}</div>
);

const Button: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string; primary?: boolean; type?: "button" | "submit" }> = 
({ children, onClick, className = '', primary, type = "button" }) => (
  <button type={type} onClick={onClick} className={`xi-button ${primary ? 'xi-button-primary' : 'xi-button-secondary'} ${className}`}>{children}</button>
);

/**
 * VIEW: COACH (NEURAL RELAY)
 */
const CoachView: React.FC<{ 
  results: ComprehensiveResult | null; 
  activeThread: ChatThread;
  updateMessages: (threadId: string, messages: ChatMessage[]) => void;
}> = ({ results, activeThread, updateMessages }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<{data: string, type: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeThread.messages, loading, scrollToBottom]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAttachment({
          data: (ev.target?.result as string).split(',')[1],
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || loading) return;

    const userParts: MessagePart[] = [{ text: input }];
    if (attachment) {
      userParts.push({ inlineData: { mimeType: attachment.type, data: attachment.data } });
    }

    const newUserMsg: ChatMessage = { 
      role: 'user', 
      text: input, 
      id: Date.now().toString(),
      attachment: attachment ? `data:${attachment.type};base64,${attachment.data}` : undefined,
      parts: userParts
    };

    const updatedMessages = [...activeThread.messages, newUserMsg];
    updateMessages(activeThread.id, updatedMessages);
    
    setInput('');
    setAttachment(null);
    setLoading(true);

    // Prepare history
    const history: ChatHistoryItem[] = activeThread.messages.map(m => ({
      role: m.role,
      parts: m.parts || [{ text: m.text }]
    }));

    const context = results ? `Stability: ${results.hallberg.R}. Pillars: ${results.autism.indicator} Autism, ${results.adhd.indicator} ADHD.` : 'No baseline data.';
    const response = await geminiService.getCoachResponse(userParts, context, history);
    
    const aiMsg: ChatMessage = { 
      role: 'ai', 
      text: response.text, 
      id: (Date.now() + 1).toString(),
      urls: response.urls,
      parts: [{ text: response.text }]
    };

    updateMessages(activeThread.id, [...updatedMessages, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 max-h-full">
      <header className="flex justify-between items-end px-4">
        <h2 className="text-7xl font-thin tall-title">relay</h2>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DB6AC]/40 hidden md:block">
          Uplink: {activeThread.title}
        </div>
      </header>
      
      <Panel className="h-[calc(100vh-26rem)] min-h-[400px] flex flex-col overflow-hidden bg-black/40 border-white/5 p-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-12 xi-scroll p-8 md:p-12">
          {activeThread.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
              <Icons.User className="w-12 h-12" />
              <p className="text-sm font-light uppercase tracking-widest">Neural connection idle. Send a signal to begin.</p>
            </div>
          )}
          {activeThread.messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.role === 'user' ? 'max-w-[85%] bg-[#4DB6AC]/10 border border-[#4DB6AC]/30 p-8 rounded-[2rem]' : 'w-full'}`}>
                {m.attachment && (
                  <img src={m.attachment} alt="Signal input" className="max-w-full md:max-w-[400px] rounded-2xl mb-8 border border-white/10 shadow-2xl" />
                )}
                {m.role === 'ai' ? <FormattedText text={m.text} /> : <p className="text-lg font-light tracking-wide">{m.text}</p>}
                
                {m.urls && m.urls.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
                    <MetaLabel className="text-[8px]">Intelligence Sources</MetaLabel>
                    <div className="flex flex-wrap gap-2">
                      {m.urls.map((link, idx) => (
                        <a key={idx} href={link.uri} target="_blank" rel="noreferrer" className="text-[10px] bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-[#4DB6AC]/20 hover:border-[#4DB6AC]/50 transition-all">
                          {link.title || 'Signal Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3 h-3 bg-[#4DB6AC] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3 h-3 bg-[#4DB6AC] rounded-full animate-bounce" />
              </div>
              <div className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.3em]">Deciphering Neural Stream...</div>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 border-t border-white/5 bg-black/40 backdrop-blur-md">
          {attachment && (
            <div className="mb-6 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 w-fit animate-in slide-in-from-left duration-300">
              <img src={`data:${attachment.type};base64,${attachment.data}`} className="w-16 h-16 object-cover rounded-xl border border-white/10" alt="Preview" />
              <div className="flex flex-col">
                <div className="text-[10px] font-black uppercase text-white/40">Ready for Uplink</div>
                <button onClick={() => setAttachment(null)} className="text-[10px] font-bold text-red-400 hover:text-red-300 mt-1 uppercase tracking-widest">Remove Attachment</button>
              </div>
            </div>
          )}
          <form onSubmit={sendMessage} className="flex gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*,application/pdf" />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 md:w-20 flex items-center justify-center bg-white/5 hover:bg-[#4DB6AC]/10 rounded-2xl border border-white/10 hover:border-[#4DB6AC]/30 transition-all group"
              title="Attach Signal"
            >
              <Icons.Plus className="group-hover:text-[#4DB6AC] transition-colors" />
            </button>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Inject query or attach biometric signal..." 
              className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 outline-none focus:border-[#4DB6AC] focus:bg-black/60 text-sm md:text-base font-light tracking-wide transition-all" 
            />
            <Button type="submit" primary onClick={() => {}} className="px-8 md:px-12">Send</Button>
          </form>
        </div>
      </Panel>
    </div>
  );
};

/**
 * CORE APPLICATION
 */
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Data Persistence
  const [lexicon, setLexicon] = useState<Record<string, number>>(() => JSON.parse(localStorage.getItem('xi_lexicon') || JSON.stringify(INITIAL_SPOON_COSTS)));
  const [responses, setResponses] = useState<Record<string, number>>(() => JSON.parse(localStorage.getItem('xi_responses') || '{}'));
  const [journal, setJournal] = useState<JournalEntry[]>(() => JSON.parse(localStorage.getItem('xi_journal') || '[]'));
  const [spoons, setSpoons] = useState<number>(() => Number(localStorage.getItem('xi_spoons') || 12));
  const [settings, setSettings] = useState<SensorySettings>(() => JSON.parse(localStorage.getItem('xi_settings') || JSON.stringify({
    darkMode: true, reducedMotion: false, dyslexicFont: false, fontSize: 16, dashboardWidgets: ['intel'], signalSubscriptions: ['System']
  })));
  const [env, setEnv] = useState<EnvironmentData>({ latitude: null, longitude: null, entropyModifier: 0.05, lastUpdated: 0 });

  // Group & Thread Management
  const [groups, setGroups] = useState<Record<string, ChatGroup>>(() => {
    const saved = localStorage.getItem('xi_groups');
    if (saved) return JSON.parse(saved);
    const initialId = 'default-node';
    return {
      [initialId]: { id: initialId, name: 'Neural Archives', timestamp: Date.now() }
    };
  });
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  const [threads, setThreads] = useState<Record<string, ChatThread>>(() => {
    const saved = localStorage.getItem('xi_threads');
    if (saved) return JSON.parse(saved);
    const id = Date.now().toString();
    return {
      [id]: { id, title: 'Initial Calibration', timestamp: Date.now(), groupId: 'default-node', messages: [
        { role: 'ai', text: 'Neural relay established. How can I assist in your stabilization today?', id: 'init' }
      ] }
    };
  });
  const [activeThreadId, setActiveThreadId] = useState<string>(() => Object.keys(threads)[0]);

  useEffect(() => {
    localStorage.setItem('xi_lexicon', JSON.stringify(lexicon));
    localStorage.setItem('xi_responses', JSON.stringify(responses));
    localStorage.setItem('xi_journal', JSON.stringify(journal));
    localStorage.setItem('xi_spoons', spoons.toString());
    localStorage.setItem('xi_settings', JSON.stringify(settings));
    localStorage.setItem('xi_threads', JSON.stringify(threads));
    localStorage.setItem('xi_groups', JSON.stringify(groups));
    document.body.classList.toggle('dyslexic', settings.dyslexicFont);
  }, [lexicon, responses, journal, spoons, settings, threads, groups]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setEnv({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          entropyModifier: 0.15,
          lastUpdated: Date.now()
        });
      }, () => console.warn("Location sensing denied."));
    }
  }, []);

  const results = useMemo(() => Object.keys(responses).length > 0 ? analyzePatterns(responses, ALL_QUESTIONS, journal, env) : null, [responses, journal, env]);
  const history = useMemo(() => getHistoryTrend(journal), [journal]);
  const stability = useMemo(() => results ? Math.round((1 - results.hallberg.R) * 100) : '--', [results]);

  const logSignal = useCallback((label: string, cost: number) => {
    const entry: JournalEntry = { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), note: label, mood: 50, sensoryLoad: cost * 10, spoonsRemaining: spoons - cost };
    setJournal(prev => [entry, ...prev]);
    setSpoons(prev => Math.max(-5, prev - cost));
  }, [spoons]);

  const updateThreadMessages = (threadId: string, messages: ChatMessage[]) => {
    setThreads(prev => {
      const thread = prev[threadId];
      if (!thread) return prev;
      
      let newTitle = thread.title;
      // Auto-title logic
      if (thread.title === 'New Neural Session' || thread.title === 'Initial Calibration') {
        const firstUser = messages.find(m => m.role === 'user');
        if (firstUser) {
          newTitle = firstUser.text.slice(0, 32) + (firstUser.text.length > 32 ? '...' : '');
        }
      }

      return {
        ...prev,
        [threadId]: { ...thread, messages, title: newTitle, timestamp: Date.now() }
      };
    });
  };

  const createNewThread = () => {
    const id = Date.now().toString();
    const targetGroupId = currentGroupId || 'default-node';
    setThreads(prev => ({
      ...prev,
      [id]: { id, title: 'New Neural Session', timestamp: Date.now(), groupId: targetGroupId, messages: [
        { role: 'ai', text: 'Neural relay established. What is the current focus?', id: `init-${id}` }
      ] }
    }));
    setActiveThreadId(id);
  };

  const createNewGroup = () => {
    const name = prompt("Enter Project Label:");
    if (!name) return;
    const id = Date.now().toString();
    setGroups(prev => ({ ...prev, [id]: { id, name, timestamp: Date.now() } }));
    setCurrentGroupId(id);
  };

  const deleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (Object.keys(threads).length <= 1) return;
    setThreads(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeThreadId === id) {
      setActiveThreadId(Object.keys(threads).find(k => k !== id) || '');
    }
  };

  const activeThread = threads[activeThreadId];
  const activeGroup = currentGroupId ? groups[currentGroupId] : null;

  return (
    <div className="min-h-screen relative flex">
      <header className="fixed top-0 left-0 w-full h-24 glass-sidebar z-[100] flex items-center justify-between px-8 md:px-20 border-b">
        <div className="flex items-center gap-6">
          <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Menu"><Icons.Menu /></Button>
          <div className="flex flex-col md:flex-row md:items-baseline gap-2 cursor-pointer group" onClick={() => setCurrentPage(Page.Landing)}>
            <div className="text-3xl md:text-5xl tall-title text-[#4DB6AC] xi-glow">xi-io:</div>
            <div className="text-lg md:text-xl font-thin text-white/60">AuDHD Field Guide</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end px-4 border-r border-white/10">
            <MetaLabel className="mb-0">Stability</MetaLabel>
            <div className={`text-xl font-thin ${stability !== '--' && Number(stability) < 40 ? 'text-red-500' : 'text-[#4DB6AC]'}`}>{stability}%</div>
          </div>
          <Panel onClick={() => setCurrentPage(Page.Spoons)} className="flex items-center gap-3 p-2 px-6 rounded-full bg-black/40">
            <Icons.Bolt /> <span className="text-lg font-black tracking-widest tabular-nums">{spoons}U</span>
          </Panel>
        </div>
      </header>

      <aside className={`fixed left-0 top-24 h-[calc(100vh-6rem)] glass-sidebar z-[90] transition-all duration-500 border-r ${isSidebarOpen ? 'w-full md:w-80' : 'w-0 opacity-0 -translate-x-full'}`}>
        <nav className="flex flex-col py-8 px-6 gap-2 overflow-y-auto no-scrollbar h-full">
          {[
            { p: Page.Landing, l: 'Dashboard', i: <Icons.Home /> },
            { p: Page.Tracking, l: 'Lexicon', i: <Icons.Journal /> },
            { p: Page.Coach, l: 'Neural Relay', i: <Icons.User /> },
            { p: Page.Resources, l: 'Intelligence', i: <Icons.Patterns /> },
            { p: Page.Calendar, l: 'Chronos', i: <Icons.Calendar /> },
            { p: Page.Settings, l: 'Data Vault', i: <Icons.Bolt /> }
          ].map(item => (
            <button key={item.p} onClick={() => setCurrentPage(item.p)} className={`flex items-center gap-4 p-5 rounded-2xl transition-all border ${currentPage === item.p ? 'tab-active' : 'border-transparent text-white/30 hover:text-white hover:bg-white/5'}`}>
              {item.i} <span className="text-[10px] font-black uppercase tracking-widest">{item.l}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className={`flex-1 min-h-screen pt-48 pb-32 px-6 md:px-20 transition-all ${isSidebarOpen ? 'md:pl-[360px]' : 'pl-6 md:pl-20'} xl:pr-[400px]`}>
        <div className="max-w-5xl mx-auto h-full">
          {currentPage === Page.Landing && <LandingView results={results} stability={stability} setCurrentPage={setCurrentPage} />}
          {currentPage === Page.Assessment && <AssessmentView setResponses={setResponses} setCurrentPage={setCurrentPage} />}
          {currentPage === Page.Tracking && <TrackingView journal={journal} lexicon={lexicon} logSignal={logSignal} />}
          {currentPage === Page.Coach && <CoachView key={activeThreadId} results={results} activeThread={activeThread} updateMessages={updateThreadMessages} />}
          {currentPage === Page.Resources && <ResourcesView />}
          {currentPage === Page.Calendar && <ChronosView history={history} />}
          {currentPage === Page.Spoons && <SpoonsView spoons={spoons} setSpoons={setSpoons} />}
          {currentPage === Page.Settings && <SettingsView settings={settings} setSettings={setSettings} handleExport={() => {}} handleImport={() => {}} />}
        </div>
      </main>

      {/* REFINED CONTEXT-AWARE RIGHT SIDEBAR: NEURAL ARCHIVE */}
      <aside className="hidden xl:flex flex-col w-[360px] h-[calc(100vh-6rem)] fixed right-0 top-24 glass-sidebar border-l p-8 gap-8 overflow-y-auto z-[80] xi-scroll no-scrollbar">
        {currentPage === Page.Coach ? (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right duration-500 h-full">
            <div>
              <MetaLabel>Archive Operations</MetaLabel>
              <Button primary onClick={createNewThread} className="w-full py-6 mt-2">Initialize New Session</Button>
            </div>

            <div className="flex-1 flex flex-col gap-6">
              {!currentGroupId ? (
                <>
                  <div className="flex justify-between items-center">
                    <MetaLabel>Neural Groups</MetaLabel>
                    <button onClick={createNewGroup} className="text-[#4DB6AC] hover:text-[#A7FFEB] transition-colors"><Icons.Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3">
                    {(Object.values(groups) as ChatGroup[]).sort((a,b) => b.timestamp - a.timestamp).map(group => (
                      <div 
                        key={group.id} 
                        onClick={() => setCurrentGroupId(group.id)}
                        className="p-5 rounded-3xl border border-transparent bg-white/5 hover:bg-[#4DB6AC]/10 hover:border-[#4DB6AC]/30 transition-all cursor-pointer group flex items-center gap-4"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-[#4DB6AC]/10 flex items-center justify-center text-[#4DB6AC]"><Icons.Patterns /></div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-sm font-medium truncate text-white/80 group-hover:text-white">{group.name}</div>
                          <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mt-1">
                            {Object.values(threads).filter(t => t.groupId === group.id).length} Nodes Loaded
                          </div>
                        </div>
                        <Icons.ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-40" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setCurrentGroupId(null)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#4DB6AC] hover:text-[#A7FFEB] transition-colors"
                    >
                      <Icons.ArrowRight className="rotate-180 w-3 h-3" /> Back to Groups
                    </button>
                    <div className="flex justify-between items-center mt-4">
                      <MetaLabel>Captures: {activeGroup?.name}</MetaLabel>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {(Object.values(threads) as ChatThread[])
                      .filter(t => t.groupId === currentGroupId)
                      .sort((a,b) => b.timestamp - a.timestamp)
                      .map(thread => (
                        <div 
                          key={thread.id} 
                          onClick={() => setActiveThreadId(thread.id)}
                          className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${activeThreadId === thread.id ? 'bg-[#4DB6AC]/10 border-[#4DB6AC]/50 shadow-[0_0_30px_rgba(77,182,172,0.1)]' : 'bg-white/5 border-transparent hover:border-white/10'}`}
                        >
                          {activeThreadId === thread.id && <div className="absolute left-0 top-0 w-1 h-full bg-[#4DB6AC] xi-glow" />}
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-[8px] font-black uppercase text-[#4DB6AC]/60 tracking-widest">
                              {new Date(thread.timestamp).toLocaleDateString()} // Node {thread.id.slice(-4)}
                            </div>
                            <button 
                              onClick={(e) => deleteThread(thread.id, e)} 
                              className="opacity-0 group-hover:opacity-100 text-red-500/50 hover:text-red-500 p-1 transition-opacity"
                              title="Purge Capture"
                            >
                              <Icons.Plus className="rotate-45 w-4 h-4" />
                            </button>
                          </div>
                          <div className={`text-sm font-light truncate mb-1 ${activeThreadId === thread.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                            {thread.title}
                          </div>
                          <div className="text-[8px] font-black uppercase tracking-widest opacity-20">
                            {thread.messages.length} Signal Frames
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Panel className="bg-[#4DB6AC]/5 border-[#4DB6AC]/20 relative overflow-hidden">
              <div className="xi-scan-line"></div>
              <MetaLabel>Stability Metric</MetaLabel>
              <div className="text-[10px] italic text-white/40 mb-4">"Quantizing environmental load factors."</div>
              <div className="flex flex-wrap gap-2">
                {['PDA', 'R-FACTOR', 'SENSING'].map(k => <span key={k} className="text-[8px] font-black border border-[#4DB6AC]/30 px-2 py-1 rounded text-[#4DB6AC]">{k}</span>)}
              </div>
            </Panel>
            <Panel>
              <MetaLabel>Neural Load Ratios</MetaLabel>
              <div className="h-3 w-full bg-white/5 rounded-full mt-4 flex overflow-hidden">
                <div className="bg-[#4DB6AC] h-full" style={{ width: results ? `${results.autism.percentile}%` : '50%' }} />
                <div className="bg-[#A7FFEB] h-full" style={{ width: results ? `${results.adhd.percentile}%` : '50%' }} />
              </div>
              <div className="flex justify-between mt-3 text-[8px] font-black uppercase tracking-widest opacity-40">
                <span>Autistic Load</span>
                <span>ADHD Load</span>
              </div>
            </Panel>
            <div className="mt-auto text-center opacity-10 text-[8px] font-black uppercase tracking-[0.4em] pt-20">Xibalba.Systems // Neural.Archive</div>
          </div>
        )}
      </aside>
    </div>
  );
};

/**
 * SUB-VIEWS
 */
const LandingView: React.FC<{ results: ComprehensiveResult | null; stability: string | number; setCurrentPage: (p: Page) => void }> = ({ results, stability, setCurrentPage }) => {
  if (!results) return (
    <div className="space-y-12">
      <h1 className="text-9xl font-thin tall-title xi-glow">initialize</h1>
      <p className="text-2xl font-thin text-white/40 italic">Calibration required for neural invariants.</p>
      <Button primary onClick={() => setCurrentPage(Page.Assessment)} className="w-full py-10 text-2xl">Start Mapping Flow</Button>
    </div>
  );
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12">
        <div><h2 className="text-8xl font-thin tall-title">field</h2><p className="text-xl text-white/40 italic">Active System Pulse: Nominal</p></div>
        <Button onClick={() => setCurrentPage(Page.Tracking)} primary>Signal Input</Button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Panel className="flex flex-col items-center justify-center py-16"><MetaLabel>R-Factor Stability</MetaLabel><div className="text-9xl font-thin text-[#4DB6AC] xi-text-glow">{stability}%</div></Panel>
        <Panel className="space-y-4"><MetaLabel>Stabilization Protocol</MetaLabel>
          {results.hallberg.actionableIntel.map(intel => (
            <div key={intel} className="flex gap-4 p-4 bg-white/5 rounded-2xl text-xs italic text-white/70"><Icons.Check /> {intel}</div>
          ))}
        </Panel>
      </div>
    </div>
  );
};

const AssessmentView: React.FC<{ setResponses: any; setCurrentPage: any }> = ({ setResponses, setCurrentPage }) => {
  const [idx, setIdx] = useState(0);
  const q = ALL_QUESTIONS[idx];
  const handleChoice = (v: number) => {
    setResponses((p: any) => ({ ...p, [q.id]: v }));
    if (idx < ALL_QUESTIONS.length - 1) setIdx(idx + 1);
    else setCurrentPage(Page.Landing);
  };
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom duration-500">
      <header><MetaLabel>Node {idx + 1} / {ALL_QUESTIONS.length}</MetaLabel><div className="h-1 w-full bg-white/5 mt-6 rounded-full overflow-hidden"><div className="h-full bg-[#4DB6AC]" style={{ width: `${((idx + 1) / ALL_QUESTIONS.length) * 100}%` }} /></div></header>
      <h2 className="text-4xl font-thin text-white italic">"{q.text}"</h2>
      <div className="grid grid-cols-1 gap-4">
        {q.options.map(o => <button key={o.label} onClick={() => handleChoice(o.value)} className="p-8 text-left bg-white/5 border border-white/5 rounded-3xl hover:border-[#4DB6AC] hover:bg-[#4DB6AC]/10 transition-all text-xl font-thin">{o.label}</button>)}
      </div>
    </div>
  );
};

const TrackingView: React.FC<{ journal: JournalEntry[]; lexicon: Record<string, number>; logSignal: any }> = ({ journal, lexicon, logSignal }) => (
  <div className="space-y-12">
    <h2 className="text-8xl font-thin tall-title">signals</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(lexicon).map(([label, cost]) => (
        <Panel key={label} onClick={() => logSignal(label, cost)} className="hover:bg-[#4DB6AC]/10">
          <MetaLabel>-{cost}U Units</MetaLabel>
          <h3 className="text-lg font-thin">{label}</h3>
        </Panel>
      ))}
    </div>
    <div className="pt-12 border-t border-white/5 space-y-4">
      <MetaLabel>Signal History</MetaLabel>
      {journal.slice(0, 5).map(e => (
        <Panel key={e.id} className="p-5 flex justify-between items-center group bg-black/20">
          <div><div className="text-[9px] text-[#4DB6AC]">{new Date(e.timestamp).toLocaleTimeString()}</div><div className="text-xl font-thin italic text-white/60">{e.note}</div></div>
          <div className="text-3xl font-thin text-white/20 group-hover:text-[#4DB6AC]">{e.spoonsRemaining}U</div>
        </Panel>
      ))}
    </div>
  </div>
);

const ResourcesView: React.FC = () => (
  <div className="space-y-12 animate-in fade-in duration-700">
    <h2 className="text-8xl font-thin tall-title">intelligence</h2>
    <div className="grid grid-cols-1 gap-8">
      {ARTICLES.map(article => (
        <Panel key={article.id} className="space-y-6">
          <div>
            <MetaLabel>{article.category} // {article.readTime}</MetaLabel>
            <h3 className="text-3xl font-thin text-[#4DB6AC]">{article.title}</h3>
          </div>
          <div className="space-y-4">
            {article.content.map((paragraph, idx) => (
              <p key={idx} className="text-sm text-white/70 leading-relaxed font-light">{paragraph}</p>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  </div>
);

const ChronosView: React.FC<{ history: HistoryPoint[] }> = ({ history }) => (
  <div className="space-y-12">
    <h2 className="text-7xl font-thin tall-title">chronos</h2>
    <Panel className="p-12"><MetaLabel>Neural Variance (14D)</MetaLabel>
      <div className="h-48 mt-10"><svg viewBox="0 0 1000 300" className="w-full h-full"><path d={history.length > 0 ? `M 0 ${300 - (history[0].value * 300)} ${history.map((p, i) => `L ${(i / (history.length - 1)) * 1000} ${300 - (p.value * 300)}`).join(' ')}` : "M 0 150 L 1000 150"} fill="none" stroke="#4DB6AC" strokeWidth="3" /></svg></div>
    </Panel>
  </div>
);

const SpoonsView: React.FC<{ spoons: number; setSpoons: any }> = ({ spoons, setSpoons }) => (
  <div className="flex flex-col items-center py-16 space-y-12">
    <h2 className="text-8xl font-thin tall-title">energy</h2>
    <div className={`w-72 h-72 rounded-full border-2 flex flex-col items-center justify-center transition-all ${spoons < 3 ? 'border-red-500 xi-glow shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 'border-[#4DB6AC]'}`}>
      <div className="text-[120px] font-thin text-[#4DB6AC] tabular-nums">{spoons}</div><MetaLabel>Units</MetaLabel>
    </div>
    <div className="flex gap-4"><Button primary onClick={() => setSpoons(12)}>Full Charge</Button><Button onClick={() => setSpoons((s: any) => s+2)}>+2 Buff</Button></div>
  </div>
);

const SettingsView: React.FC<{ settings: SensorySettings; setSettings: any; handleExport: any; handleImport: any }> = ({ settings, setSettings, handleExport, handleImport }) => (
  <div className="space-y-12">
    <h2 className="text-7xl font-thin tall-title">vault</h2>
    <Panel className="space-y-6">
      <MetaLabel>Neural Invariants</MetaLabel>
      <div className="flex justify-between items-center p-4 border-b border-white/5">
        <span className="text-xl font-thin">Dyslexic Rendering</span>
        <input type="checkbox" checked={settings.dyslexicFont} onChange={() => setSettings({ ...settings, dyslexicFont: !settings.dyslexicFont })} className="w-6 h-6 accent-[#4DB6AC]" />
      </div>
      <div className="pt-6 grid grid-cols-2 gap-4">
        <Button onClick={handleExport}>Export Ghost</Button>
        <div className="relative"><Button onClick={() => {}} className="w-full">Import Node</Button><input type="file" onChange={handleImport} className="absolute inset-0 opacity-0 cursor-pointer" /></div>
      </div>
      <Button className="w-full text-red-500 mt-6" onClick={() => { if(confirm("Initiate Data Purge?")) { localStorage.clear(); window.location.reload(); } }}>Purge Local Memory</Button>
    </Panel>
  </div>
);

const Icons = {
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Bolt: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  Patterns: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Calendar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Journal: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Plus: ({ className = "" }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ArrowRight: ({ className = "" }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
};

export default App;