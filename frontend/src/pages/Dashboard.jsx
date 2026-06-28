import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BlogGenerator from '../components/BlogGenerator';
import RichTextEditor from '../components/RichTextEditor';
import ImageGallery from '../components/ImageGallery';
import Export from '../components/Export';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentBlog, setCurrentBlog] = useState(null);
  const [activeNav, setActiveNav] = useState('generator'); // generator, editor, images, export
  const [aiModel, setAiModel] = useState('llama-3.3-70b');

  const handleBlogGenerated = (blogData) => {
    setCurrentBlog(blogData);
    setActiveNav('editor');
  };

  const handleBlogUpdate = (updatedBlog) => {
    setCurrentBlog(updatedBlog);
  };

  const handleNewBlog = () => {
    if (confirm('Deploy a new blog instance? Current unsaved review progress will be reset.')) {
      setCurrentBlog(null);
      setActiveNav('generator');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top High-Tech Command Bar */}
      <header className="bg-[#0b0d14]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Neon Portal Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                <span>AI CREATOR STUDIO</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">LANGCHAIN + GROQ</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Commander: <span className="text-purple-400 font-semibold">{user?.name || user?.email || 'Elite Creator'}</span></p>
            </div>
          </div>
        </div>

        {/* Global Action Terminal */}
        <div className="flex items-center gap-3">
          {currentBlog && (
            <button
              onClick={handleNewBlog}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-blue-400 hover:text-white border border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New AI Instance</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Groq Llama 3.3 70B Active</span>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Disconnect</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Left Sidebar Command Center (As displayed in user design prompt) */}
        <aside className="w-full lg:w-72 bg-[#0a0c13] border-r border-slate-800/80 p-4 flex flex-col gap-6 flex-shrink-0 z-40 shadow-2xl">
          
          {/* Quick Action Category Title */}
          <div>
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>Quick Action Bar</span>
              <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">STUDIO</span>
            </div>

            {/* Application Section Navigation */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Generator Button */}
              <button
                onClick={() => setActiveNav('generator')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative ${
                  activeNav === 'generator' && !currentBlog
                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white font-semibold'
                    : 'bg-[#0f131f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs tracking-wide font-bold uppercase">Generator</span>
                {!currentBlog && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
              </button>

              {/* Preview / Edit Button */}
              <button
                onClick={() => currentBlog ? setActiveNav('editor') : alert('Generate a blog first to unlock the Studio Review & Editor')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative ${
                  activeNav === 'editor' && currentBlog
                    ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] text-white font-semibold'
                    : currentBlog 
                    ? 'bg-[#0f131f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    : 'bg-[#0c0f17] border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <span className="text-xs tracking-wide font-bold uppercase">Preview</span>
                {currentBlog && activeNav !== 'editor' && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
              </button>

              {/* Images Studio Button */}
              <button
                onClick={() => currentBlog ? setActiveNav('images') : alert('Generate a blog first to unlock the Image Asset Studio')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  activeNav === 'images' && currentBlog
                    ? 'bg-cyan-600/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-white font-semibold'
                    : currentBlog 
                    ? 'bg-[#0f131f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    : 'bg-[#0c0f17] border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs tracking-wide font-bold uppercase">Import</span>
              </button>

              {/* Export Studio Button */}
              <button
                onClick={() => currentBlog ? setActiveNav('export') : alert('Generate a blog first to unlock the Export Engine')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  activeNav === 'export' && currentBlog
                    ? 'bg-pink-600/20 border-pink-500 shadow-[0_0_15px_rgba(244,114,182,0.3)] text-white font-semibold'
                    : currentBlog 
                    ? 'bg-[#0f131f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    : 'bg-[#0c0f17] border-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <span className="text-xs tracking-wide font-bold uppercase">Export</span>
              </button>

              {/* Compare Button */}
              <button
                onClick={() => alert('AI Knowledge Compare Engine: Compare original LLM generation vs current live manual review edits')}
                className="p-3.5 rounded-xl border bg-[#0f131f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 flex flex-col items-center justify-center gap-2 transition-all"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="text-xs tracking-wide font-bold uppercase">Compare</span>
              </button>

              {/* Router Button */}
              <button
                onClick={() => alert('Neural Router Active: Orchestrating between Groq API, Unsplash API, and local fallback pipelines.')}
                className="p-3.5 rounded-xl border bg-[#0f131f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 flex flex-col items-center justify-center gap-2 transition-all"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span className="text-xs tracking-wide font-bold uppercase">Router</span>
              </button>
            </div>
          </div>

          {/* AI MODEL CONFIGURATION PANEL */}
          <div>
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>AI Model Configuration</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">NEW</span>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setAiModel('llama-3.3-70b')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  aiModel === 'llama-3.3-70b'
                    ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'bg-[#0f131f] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Groq Llama 3.3 70B</h4>
                    <p className="text-[10px] text-slate-400">Blazing Fast • Sub-Second</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${aiModel === 'llama-3.3-70b' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'}`}>
                  {aiModel === 'llama-3.3-70b' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </label>

              <label
                onClick={() => setAiModel('mixtral-8x7b')}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  aiModel === 'mixtral-8x7b'
                    ? 'bg-purple-600/10 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'bg-[#0f131f] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Mixtral 8x7B</h4>
                    <p className="text-[10px] text-slate-400">Mixture of Experts • High SEO</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${aiModel === 'mixtral-8x7b' ? 'border-purple-500 bg-purple-500' : 'border-slate-600'}`}>
                  {aiModel === 'mixtral-8x7b' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
              </label>
            </div>
          </div>

          {/* TELEMETRY & WORKFLOW GRAPH */}
          <div className="mt-auto pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px]">INFERENCE ENGINE</span>
              <span className="text-emerald-400 font-mono font-bold">OPTIMIZED</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-full animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 italic">LangChain orchestration bypasses queue latency for instant throughput.</p>
          </div>
        </aside>

        {/* Center Main Workstation Panel */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 bg-gradient-to-b from-[#07090e] via-[#0b0e17] to-[#07090e] relative overflow-y-auto">
          
          {/* Background High-tech Ambient Orbs */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            
            {/* View 1: Generator */}
            {(!currentBlog || activeNav === 'generator') && (
              <div className="animate-fadeIn">
                <BlogGenerator onBlogGenerated={handleBlogGenerated} aiModel={aiModel} />
              </div>
            )}

            {/* View 2: Studio Live Editor & Preview */}
            {currentBlog && activeNav === 'editor' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-800/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                  <RichTextEditor 
                    blog={currentBlog} 
                    onUpdate={handleBlogUpdate}
                    images={currentBlog.images}
                  />
                </div>
              </div>
            )}

            {/* View 3: Images Studio */}
            {currentBlog && activeNav === 'images' && (
              <div className="animate-fadeIn">
                <ImageGallery blog={currentBlog} onUpdate={handleBlogUpdate} />
              </div>
            )}

            {/* View 4: Export Studio */}
            {currentBlog && activeNav === 'export' && (
              <div className="animate-fadeIn">
                <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-800/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500" />
                  <Export blog={currentBlog} editorContent={currentBlog?.content} />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
