
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Page, JournalEntry, ChatThread, ChatMessage, UserIdentity, ComprehensiveResult, Addon, SpotifyState, SubscriptionTier, SpotifyTrack, NeuralNode, EmergencyContact, NewsArticle, HistoryPoint } from './types.ts';
import { ALL_QUESTIONS, NEURAL_NODES, ADDONS, NEURAL_HARMONICS, DEMO_BASELINE, U_UNIT_COSTS, NEWS_CATEGORIES, RELAY_VISUAL_PROMPTS, INTEL_VISUAL_PROMPTS } from './constants.ts';
import { analyzePatterns, getHistoryTrend } from './services/hallbergMath.ts';
import { geminiService, MessagePart, ChatHistoryItem } from './services/geminiService.ts';
import { FormattedText } from './components/FormattedText.ts';
import { Button, MetaLabel } from './components/primitives.ts';

const Panel: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; locked?: boolean }> = ({ children, className = '', onClick, locked }) => (
  <section 
    onClick={!locked ? onClick : undefined} 
    className={`xi-panel p-8 relative overflow-hidden ${className} ${onClick && !locked ? 'cursor-pointer hover:border-[#4DB6AC]/40' : ''}`}
  >
    {locked && (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
        <Icons.Vault className="text-[#4DB6AC] mb-2" />
        <div className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC]">Uplink Restricted</div>
        <p className="text-[8px] opacity-40 uppercase mt-1">Upgrade to Pro Neural Link</p>
      </div>
    )}
    {children}
  </section>
);

const Icons = {
  Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  Journal: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Bolt: ({ className = "" }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Vault: ({ className = "" }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Report: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Activity: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Warning: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Library: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

const TelemetrySidebar: React.FC<{ results: ComprehensiveResult; stability: number; selectedPoint?: HistoryPoint | null }> = ({ results, stability, selectedPoint }) => (
  <aside className="w-80 flex flex-col border-l border-white/5 bg-[#080808]/50 p-6 overflow-y-auto xi-scroll">
    <MetaLabel className="mb-6">{selectedPoint ? 'Temporal Slice' : 'Neural Telemetry'}</MetaLabel>
    
    <div className="space-y-8">
      {selectedPoint ? (
        <div>
          <div className="text-3xl font-thin text-white mb-2">{selectedPoint.date}</div>
          <div className="p-4 bg-white/5 rounded border border-white/5 mb-6">
            <MetaLabel className="text-[8px] opacity-40">Load Index</MetaLabel>
            <div className="text-3xl font-bold tabular-nums text-orange-400">{(selectedPoint.value * 100).toFixed(0)}%</div>
          </div>
          <p className="text-sm italic opacity-60">"{selectedPoint.noteSnippet}"</p>
        </div>
      ) : (
        <>
          <div>
            <div className="text-5xl font-thin tracking-tighter text-white">{stability}%</div>
            <MetaLabel className="text-[8px] opacity-40 mt-1">Stability Confidence</MetaLabel>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[results.autism, results.adhd, results.masking, results.burnout].map(p => (
              <div key={p.label} className="p-3 bg-white/5 rounded border border-white/5">
                <div className="text-[8px] uppercase opacity-30 mb-1">{p.label}</div>
                <div className="text-lg font-bold">{p.percentile}%</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <MetaLabel className="text-[8px] opacity-40">Actionable Intel</MetaLabel>
            {results.hallberg.actionableIntel.map((intel, i) => (
              <div key={i} className="text-[11px] font-light text-white/70 italic flex gap-2">
                <div className="w-1 h-1 bg-[#4DB6AC] rounded-full mt-1.5 shrink-0" />
                {intel}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </aside>
);

const App: React.FC = () => {
  const [identity, setIdentity] = useState<UserIdentity>(() => {
    const saved = localStorage.getItem('xi_identity');
    return saved ? JSON.parse(saved) : {
      id: 'user-base',
      username: 'G-STAKEHOLDER',
      isProvisioned: false,
      tier: 'Standard',
      privacyMode: 'LocalOnly',
      uplinkType: 'Local',
      avatarColor: '#4DB6AC',
      emergencyContacts: [],
      subscribedCategories: ['cat-sensory', 'cat-adhd'],
      neuralConfig: { uplinkType: 'Local', privacyLevel: 'ZeroKnowledge', autoSync: false },
      subscriptionActive: false
    };
  });
  
  const [currentPage, setCurrentPage] = useState<Page>(identity.isProvisioned ? Page.Landing : Page.Provisioning);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [responses, setResponses] = useState<Record<string, number>>(() => JSON.parse(localStorage.getItem('xi_responses') || '{}'));
  const [lexicon, setLexicon] = useState<JournalEntry[]>(() => JSON.parse(localStorage.getItem('xi_lexicon') || '[]'));
  const [uUnits, setUUnits] = useState<number>(() => Number(localStorage.getItem('xi_uUnits') || 12));
  const [threads, setThreads] = useState<Record<string, ChatThread>>(() => JSON.parse(localStorage.getItem('xi_threads') || '{}'));
  const [activeThreadId, setActiveThreadId] = useState<string>('relay-baseline');
  const [activeNodeId, setActiveNodeId] = useState<string>('node-social-logic');
  const [selectedHistoryPoint, setSelectedHistoryPoint] = useState<HistoryPoint | null>(null);

  const results = useMemo(() => analyzePatterns(responses, ALL_QUESTIONS, lexicon), [responses, lexicon]);
  const historyTrend = useMemo(() => getHistoryTrend(lexicon), [lexicon]);
  const stability = useMemo(() => Math.round((1 - results.hallberg.R) * 100), [results]);

  useEffect(() => {
    localStorage.setItem('xi_responses', JSON.stringify(responses));
    localStorage.setItem('xi_lexicon', JSON.stringify(lexicon));
    localStorage.setItem('xi_uUnits', uUnits.toString());
    localStorage.setItem('xi_threads', JSON.stringify(threads));
    localStorage.setItem('xi_identity', JSON.stringify(identity));
  }, [responses, lexicon, uUnits, threads, identity]);

  const provisionDemo = () => {
    setIdentity({ ...identity, isProvisioned: true });
    setResponses(DEMO_BASELINE.responses);
    setLexicon(DEMO_BASELINE.journal as JournalEntry[]);
    setThreads(DEMO_BASELINE.threads as Record<string, ChatThread>);
    setUUnits(25);
    setCurrentPage(Page.Landing);
  };

  /**
   * Fix for missing handleExportVault. Exports the user's data as a JSON file.
   */
  const handleExportVault = () => {
    const dataToExport = {
      identity,
      responses,
      lexicon,
      uUnits,
      threads,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xi-io-vault-${identity.username.toLowerCase()}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = { role: 'user', text, id: Date.now().toString() };
    const currentThread = threads[activeThreadId] || { id: activeThreadId, messages: [], nodeId: activeNodeId, title: 'Session', timestamp: Date.now() };
    
    setThreads(prev => ({ ...prev, [activeThreadId]: { ...currentThread, messages: [...currentThread.messages, userMsg] } }));
    setIsTyping(true);
    
    const node = NEURAL_NODES.find(n => n.id === activeNodeId) || NEURAL_NODES[0];

    // Map existing messages to ChatHistoryItem for full context as per guidelines
    const history: ChatHistoryItem[] = currentThread.messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await geminiService.getCoachResponse([{ text }], node.systemInstruction, history);
    
    const aiMsg: ChatMessage = { role: 'ai', text: response.text, id: (Date.now() + 1).toString(), urls: response.urls };
    setThreads(prev => ({ ...prev, [activeThreadId]: { ...prev[activeThreadId], messages: [...prev[activeThreadId].messages, aiMsg] } }));
    setIsTyping(false);
    setUUnits(u => Math.max(0, u - 1));
  };

  const OrientationView = () => (
    <div className="max-w-4xl mx-auto space-y-16 py-12 px-8">
      <header className="space-y-4">
        <MetaLabel>Theoretical Spine</MetaLabel>
        <h1 className="clamp-title tall-title">Orientation</h1>
        <p className="text-2xl font-thin italic opacity-60">"Meaning precedes management."</p>
      </header>

      <section className="grid gap-8">
        <Panel>
          <MetaLabel>The Primary Directive</MetaLabel>
          <h2 className="text-3xl font-thin mb-4 text-white">Regulation != Morality</h2>
          <p className="text-lg opacity-80 leading-relaxed">
            Your nervous system is not a character judgment. AuDHD is a difference in regulation architecture. 
            Invisible effort exists even when outcomes fail. This app exists to name that effort.
          </p>
        </Panel>

        <div className="grid md:grid-cols-2 gap-8">
          <Panel className="border-orange-500/20">
            <MetaLabel className="text-orange-400">The 5% Factor</MetaLabel>
            <p className="text-sm opacity-70">
              Scaffolding determines outcomes. 20,000+ negative inputs before age 12 create 
              a threat-sensitive baseline. We track the R-Factor to interrupt this compounding.
            </p>
          </Panel>
          <Panel className="border-[#4DB6AC]/20">
            <MetaLabel>Relational Asymmetry</MetaLabel>
            <p className="text-sm opacity-70">
              Asymmetry must be named to be survivable. Naming the shared burden is the first step 
              toward sustainable attachment.
            </p>
          </Panel>
        </div>
      </section>
    </div>
  );

  const ReportView = () => (
    <div className="max-w-5xl mx-auto p-12 space-y-12">
      <header className="flex justify-between items-end border-b border-white/10 pb-8">
        <div>
          <MetaLabel className="text-emerald-400">Psychological Invariant Trace</MetaLabel>
          <h2 className="text-6xl font-thin tracking-tighter text-white">Physician Trace</h2>
          <div className="flex gap-4 mt-2 font-mono text-[10px] opacity-40 uppercase">
            <span>ID: {identity.username}-2.2.1</span>
            <span>Ref: XI-IO-ALPHA</span>
          </div>
        </div>
        <Button onClick={() => window.print()}><Icons.Download /> Print Clinical Standard</Button>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <Panel className="bg-[#4DB6AC]/5 border-[#4DB6AC]/20">
          <MetaLabel className="text-[#4DB6AC]">Index R (Cognitive Load)</MetaLabel>
          <div className="text-8xl font-thin text-white">{results.hallberg.R}</div>
          <p className="text-[10px] opacity-40 mt-4 italic">Recursive calculation of social load + 72h sensory entropy decay.</p>
        </Panel>
        <Panel>
          <MetaLabel>Data Fidelity</MetaLabel>
          <div className="text-8xl font-thin text-white/80">{results.hallberg.confidence}%</div>
          <p className="text-[10px] opacity-40 mt-4 italic">Internal consistency across {Object.keys(responses).length} unique probes.</p>
        </Panel>
      </div>

      <section className="space-y-6">
        <MetaLabel>Invariant Pillars</MetaLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[results.autism, results.adhd, results.masking, results.burnout].map(p => (
            <div key={p.label} className="p-6 xi-panel border-white/5">
              <div className="text-2xl font-bold text-white mb-1">{p.percentile}%</div>
              <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-8">
        <Panel className="bg-white/5">
          <MetaLabel className="mb-4">Actionable Clinical Intelligence</MetaLabel>
          <ul className="space-y-4">
            {results.hallberg.actionableIntel.map((intel, i) => (
              <li key={i} className="flex gap-4 text-sm italic text-white/80 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4DB6AC] mt-1.5 shrink-0" />
                {intel}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel className="bg-red-500/[0.02] border-red-500/10">
          <MetaLabel className="text-red-400 mb-4">Signal Contradictions</MetaLabel>
          <ul className="space-y-4">
            {results.hallberg.contradictions.map((con, i) => (
              <li key={i} className="flex gap-4 text-sm font-bold text-red-400/80 italic leading-relaxed">
                <Icons.Warning className="shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  );

  return (
    <div className="h-screen w-screen flex relative bg-[#050505] overflow-hidden">
      <div id="flashlight" />
      
      <nav className={`glass-sidebar z-10 flex flex-col shrink-0 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-4 border-b border-white/5 mb-8 h-20">
          <div className="w-8 h-8 rounded bg-[#4DB6AC] flex items-center justify-center text-black font-black text-xs shadow-[0_0_15px_#4DB6AC40]">XI</div>
          {isSidebarOpen && <span className="font-black text-xs tracking-tighter uppercase opacity-80">AuDHD Field Guide</span>}
        </div>
        
        <div className="flex-1 px-3 space-y-2 overflow-y-auto xi-scroll">
          {[
            { id: Page.Landing, label: 'Control Center', icon: Icons.Home },
            { id: Page.Assessment, label: 'Diagnostic Lab', icon: Icons.Report },
            { id: Page.Tracking, label: 'Somatic Lexicon', icon: Icons.Journal },
            { id: Page.Coach, label: 'Neural Relay', icon: Icons.Bolt },
            { id: Page.Calendar, label: 'Timeline', icon: Icons.Calendar },
            { id: Page.Resources, label: 'Survival Intel', icon: Icons.Library },
            { id: Page.Settings, label: 'Calibration', icon: Icons.User },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setCurrentPage(item.id)} 
              className={`nav-item p-4 flex items-center gap-5 rounded-lg transition-all group ${currentPage === item.id ? 'tab-active bg-white/5 text-[#4DB6AC]' : 'text-white/40 hover:text-white'}`}
            >
              <div className="nav-active-bar"></div>
              <div className="shrink-0"><item.icon /></div>
              {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>}
            </button>
          ))}
        </div>
        
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-6 text-white/20 hover:text-white transition-colors">
          <Icons.Menu />
        </button>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentPage !== Page.Provisioning && (
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-xl z-[5]">
             <div className="flex items-center gap-4">
               <MetaLabel className="mb-0">Uplink Status:</MetaLabel>
               <div className="text-[10px] font-black uppercase text-[#4DB6AC] tracking-widest">{currentPage}</div>
             </div>
             <div className="flex items-center gap-8">
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black opacity-30 uppercase">Stability Index</span>
                 <span className={`text-sm font-bold tabular-nums ${stability < 40 ? 'text-red-500 animate-pulse' : 'text-[#4DB6AC]'}`}>{stability}%</span>
               </div>
               <div className="h-8 w-[1px] bg-white/10" />
               <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black opacity-30 uppercase">Battery</span>
                 <span className="text-sm font-bold text-[#A7FFEB] tabular-nums">{uUnits}U</span>
               </div>
             </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto xi-scroll relative">
          <div className="xi-scan-line" />
          
          {currentPage === Page.Landing && (
            <div className="max-w-5xl mx-auto p-12 space-y-12">
               <OrientationView />
               <Panel className="border-[#4DB6AC]/30 bg-[#4DB6AC]/5" onClick={() => setCurrentPage(Page.Assessment)}>
                 <MetaLabel>Operational Gateway</MetaLabel>
                 <h2 className="text-4xl font-thin tracking-tighter text-white mb-4">Neural Relay Established</h2>
                 <p className="text-sm opacity-60 leading-relaxed italic max-w-lg">
                   Diagnostic probes detected. 72h sensory entropy analysis active. 
                   Proceed to Calibration to update baseline invariants.
                 </p>
                 <Button primary className="mt-8">Initialize Session</Button>
               </Panel>
            </div>
          )}

          {currentPage === Page.Provisioning && (
            <div className="h-full flex items-center justify-center p-12 text-center bg-[#050505]">
              <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-1000">
                <Icons.Bolt className="w-16 h-16 text-[#4DB6AC] mx-auto animate-pulse" />
                <div>
                  <h1 className="text-5xl font-thin tracking-tighter text-white mb-2">Initialize Trace</h1>
                  <p className="text-sm opacity-40 italic">Observer-level identity provisioning required.</p>
                </div>
                <Button primary className="w-full py-6" onClick={provisionDemo}>Provision Neural ID</Button>
              </div>
            </div>
          )}

          {currentPage === Page.Assessment && (
            <div className="max-w-4xl mx-auto p-12 space-y-12">
              <MetaLabel>Diagnostic Mode</MetaLabel>
              <h2 className="text-4xl font-thin tracking-tighter mb-8">Calibration Probes</h2>
              {ALL_QUESTIONS.map(q => (
                <Panel key={q.id}>
                  <p className="text-xl font-light mb-8 italic opacity-90">{q.text}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {q.options.map(opt => (
                      <button 
                        key={opt.label}
                        onClick={() => setResponses(prev => ({...prev, [q.id]: opt.value}))}
                        className={`px-4 py-3 rounded text-[10px] font-black uppercase border transition-all ${responses[q.id] === opt.value ? 'bg-[#4DB6AC] text-black border-[#4DB6AC]' : 'text-white/40 border-white/10'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Panel>
              ))}
              <Button primary className="w-full py-6" onClick={() => setCurrentPage(Page.Report)}>Commit Diagnostic</Button>
            </div>
          )}

          {currentPage === Page.Report && <ReportView />}

          {currentPage === Page.Calendar && (
            <div className="max-w-4xl mx-auto p-12">
               <MetaLabel>Temporal Distribution</MetaLabel>
               <h2 className="text-4xl font-thin tracking-tighter mb-12">Cognitive Timeline</h2>
               <div className="h-64 flex items-end gap-2 p-8 bg-white/5 rounded-xl border border-white/5">
                 {historyTrend.map((point, i) => (
                   <div 
                     key={i} 
                     onClick={() => setSelectedHistoryPoint(point)}
                     className="flex-1 bg-[#4DB6AC]/20 border-t border-[#4DB6AC] cursor-pointer hover:bg-[#4DB6AC]/40 transition-all relative group" 
                     style={{ height: `${point.value * 100}%` }}
                   >
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-bold">
                       {point.mood}/10
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {currentPage === Page.Coach && (
            <div className="h-full flex flex-col p-8 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {NEURAL_NODES.map(node => (
                  <button 
                    key={node.id} 
                    onClick={() => setActiveNodeId(node.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${activeNodeId === node.id ? 'bg-[#4DB6AC]/10 border-[#4DB6AC]' : 'bg-white/5 border-white/5'}`}
                  >
                    <MetaLabel className="text-[8px] mb-1">{node.name}</MetaLabel>
                    <p className="text-[10px] opacity-40 italic leading-tight">{node.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex-1 bg-white/5 rounded-2xl p-8 border border-white/5 overflow-y-auto xi-scroll space-y-8">
                {threads[activeThreadId]?.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-6 rounded-2xl ${msg.role === 'user' ? 'bg-[#4DB6AC]/10 border border-[#4DB6AC]/20' : 'bg-white/5 border border-white/5'}`}>
                      <FormattedText text={msg.text} />
                      {/* ALWAYS display URLs from groundingMetadata as required by Gemini Search guidelines */}
                      {msg.urls && msg.urls.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <MetaLabel className="mb-2 text-[8px] opacity-40">Sources</MetaLabel>
                          <div className="flex flex-wrap gap-2">
                            {msg.urls.map((url, idx) => (
                              <a 
                                key={idx} 
                                href={url.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#4DB6AC] hover:text-white transition-colors bg-white/5 px-2 py-1 rounded border border-white/5 flex items-center gap-1"
                              >
                                {url.title || "Reference"}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-xs italic opacity-40 animate-pulse">Relay processing...</div>}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      handleSend(input.value);
                      input.value = ''; // Clear input on send
                    }
                  }}
                  placeholder="Paste confusing social signal or task list..." 
                  className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm focus:outline-none focus:border-[#4DB6AC]/50"
                />
              </div>
            </div>
          )}

          {currentPage === Page.Settings && (
            <div className="max-w-3xl mx-auto p-12 space-y-12">
               <MetaLabel>Identity Configuration</MetaLabel>
               <Panel>
                 <MetaLabel className="mb-4">Stakeholder Profile</MetaLabel>
                 <div className="space-y-6">
                    <div>
                      <span className="text-[10px] uppercase opacity-40 font-bold">Pseudonym</span>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded p-3 mt-1" 
                        value={identity.username} 
                        onChange={(e) => setIdentity({...identity, username: e.target.value})}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase opacity-40 font-bold">Lexicon Type</span>
                      <div className="flex gap-2 mt-1">
                        {['Spoons', 'U-Units', 'Charges'].map(l => (
                          <button key={l} className="px-3 py-1.5 bg-white/5 rounded text-[10px] font-bold uppercase">{l}</button>
                        ))}
                      </div>
                    </div>
                 </div>
               </Panel>

               <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                 <Button danger onClick={() => { localStorage.clear(); window.location.reload(); }}><Icons.Trash /> Wipe Neural Trace</Button>
                 <Button onClick={handleExportVault}><Icons.Download /> Export Encrypted Vault</Button>
               </div>
            </div>
          )}
        </div>
      </main>

      <div className="hidden xl:block">
        <TelemetrySidebar results={results} stability={stability} selectedPoint={selectedHistoryPoint} />
      </div>
    </div>
  );
};

export default App;
