import { useState } from 'react';
import { blogAPI } from '../api';

const TONES = [
  { value: 'professional', label: '🛡️ Professional & Authoritative' },
  { value: 'conversational', label: '💬 Conversational & Engaging' },
  { value: 'thought_leadership', label: '💡 Thought Leadership & Futurist' },
  { value: 'concise', label: '⚡ Concise & Direct' },
  { value: 'humorous', label: '🎭 Witty & Entertaining' }
];

export default function BlogGenerator({ onBlogGenerated, aiModel }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please provide an article topic or prompt');
      return;
    }

    setError('');
    setLoading(true);
    setActiveStep('Initializing Groq Llama 3.3 70B Engine...');

    try {
      // Simulate multi-step telemetry feedback for premium feel
      setTimeout(() => setActiveStep('Engaging LangChain Neural Routing...'), 1500);
      setTimeout(() => setActiveStep('Synthesizing high-level article structure & fetching AI image assets...'), 3000);

      const response = await blogAPI.generateBlog(topic, tone, '', 'markdown');
      if (response?.data) {
        onBlogGenerated(response.data);
      } else {
        throw new Error('No content returned from AI Engine');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate blog. Please verify API keys and try again.');
    } finally {
      setLoading(false);
      setActiveStep('');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Spectacular Background Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Engine Spec Badge */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Studio Generation Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Deploy New AI Blog Instance
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Input your core topic. Our advanced LangChain pipeline automatically orchestrates high-end formatting and image synthesis.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#0b0e17] border border-slate-800 rounded-xl flex items-center gap-3 shadow-inner">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Engine</div>
            <div className="text-xs font-extrabold text-white uppercase">{aiModel === 'mixtral-8x7b' ? 'Mixtral 8x7B' : 'Groq Llama 3.3 70B'}</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-center gap-3 backdrop-blur-md relative z-10 animate-pulse">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center justify-between">
            <span>Core Article Topic / Prompt</span>
            <span className={`text-[11px] font-mono ${topic.length > 180 ? 'text-red-400' : 'text-slate-500'}`}>{topic.length} / 200</span>
          </label>
          <div className="relative">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              className="w-full glass-input rounded-xl p-4 text-slate-100 placeholder-slate-500 text-base leading-relaxed focus:ring-2 focus:ring-blue-500/50 resize-none shadow-inner"
              placeholder="e.g., The Transformative Impact of Quantum Computing on Decrypting Legacy Systems and Advanced Cryptography in 2026..."
              disabled={loading}
              maxLength={200}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-blue-400">💡 PRO TIP:</span>
            <span>Be as descriptive as possible. The AI automatically structures headers, SEO meta, and key takeaways.</span>
          </p>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2.5">
            Architectural Tone of Voice
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full glass-input rounded-xl p-4 text-slate-100 bg-[#0f121c] focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-inner"
            disabled={loading}
          >
            {TONES.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#0f121c] text-slate-100 py-2">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full py-5 glass-button-primary rounded-xl font-extrabold text-base tracking-wide uppercase shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-bold tracking-widest text-white animate-pulse">SYNTHESIZING ARTICLE...</span>
                </div>
                <span className="text-[11px] text-blue-200 font-mono font-medium tracking-normal opacity-90">{activeStep}</span>
              </div>
            ) : (
              <>
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate High-Level Article</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
