import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { blogAPI } from '../api';

const TONES = [
  { value: 'professional', label: '🛡️ Professional & Authoritative' },
  { value: 'conversational', label: '💬 Conversational & Engaging' },
  { value: 'thought_leadership', label: '💡 Thought Leadership' },
  { value: 'concise', label: '⚡ Concise & Direct' },
  { value: 'humorous', label: '🎭 Witty & Entertaining' }
];

export default function RichTextEditor({ blog, onUpdate, images }) {
  const [content, setContent] = useState(blog.content || '');
  const [selectedText, setSelectedText] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(true); // Default to gorgeous article preview mode

  const handleSelection = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const selected = content.slice(start, end).trim();

    if (selected.length > 0) {
      setSelectedText(selected);
      setHasSelection(true);
    } else {
      setHasSelection(false);
      setSelectedText('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await blogAPI.updateBlog(blog.blogId, { content });
      onUpdate({ ...blog, content });
      alert('✅ Live review modifications saved to database successfully!');
    } catch (err) {
      alert('❌ Failed to save modifications. Please verify backend connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleTextAction = async (action, tone = null) => {
    if (!selectedText || selectedText.length < 10) {
      alert('⚠️ Please select at least 10 characters of text in Edit Mode to trigger AI actions.');
      return;
    }

    setProcessing(true);
    setShowToneMenu(false);

    try {
      let response;
      
      switch (action) {
        case 'rewrite':
          response = await blogAPI.rewriteText(blog.blogId, selectedText, blog.tone || 'professional');
          break;
        case 'improveSEO':
          response = await blogAPI.improveSEO(blog.blogId, selectedText);
          break;
        case 'changeTone':
          response = await blogAPI.changeTone(blog.blogId, selectedText, tone);
          break;
        default:
          throw new Error('Unknown action');
      }

      const newText = response?.data?.data?.regeneratedText ?? response?.data?.regeneratedText;

      if (newText) {
        const updated = content.replace(selectedText, newText);
        setContent(updated);
        onUpdate({ ...blog, content: updated });
        alert('✨ AI text transformation applied successfully!');
      } else {
        throw new Error('No replacement returned from server.');
      }

    } catch (err) {
      alert('❌ Failed to process AI text transformation. Please check API keys or server logs.');
    } finally {
      setProcessing(false);
      setShowToneMenu(false);
    }
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* Top Studio Review Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>Live Changeable Content Review</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            {blog.title || 'AI Generated Article'}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Toggle between Live Web Preview and Interactive AI Editor to fine-tune your content before exporting.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mode Switcher */}
          <div className="bg-[#0b0d14] p-1.5 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setPreviewMode(true)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                previewMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👁️ Web Preview
            </button>
            <button
              onClick={() => setPreviewMode(false)}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                !previewMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✏️ Studio Editor
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{saving ? 'Persisting...' : 'Save Modifications'}</span>
          </button>
        </div>
      </div>

      {/* Quick AI Actions Toolbar (Active when selecting text in Editor mode) */}
      {!previewMode && (
        <div className="p-4 bg-[#0b0d14] border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-extrabold text-white uppercase tracking-wider">AI Co-Pilot Controls</div>
              <div className="text-[11px] text-slate-400">Highlight text below to trigger AI rewrites, SEO boost, or tone changes.</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleTextAction('rewrite')}
              disabled={processing || !hasSelection}
              className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>✨ AI Rewrite</span>
            </button>

            <button
              onClick={() => handleTextAction('improveSEO')}
              disabled={processing || !hasSelection}
              className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>🎯 Boost SEO</span>
            </button>

            <div className="relative">
              <button
                onClick={() => hasSelection ? setShowToneMenu((v) => !v) : alert('⚠️ Please highlight text in the editor below first.')}
                disabled={processing || !hasSelection}
                className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>🎨 Shift Tone</span>
              </button>

              {showToneMenu && (
                <div className="absolute right-0 mt-2 bg-[#0f121c] border border-slate-700 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] p-4 w-64 z-50 backdrop-blur-2xl">
                  <div className="text-xs font-extrabold text-slate-300 mb-3 uppercase tracking-wider pb-2 border-b border-slate-800">Select Target Tone</div>
                  <div className="flex flex-col gap-1.5">
                    {TONES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => handleTextAction('changeTone', t.value)}
                        disabled={processing}
                        className="w-full text-left px-3 py-2.5 bg-slate-800/40 hover:bg-slate-700/60 text-slate-200 rounded-xl font-medium text-xs transition-all flex items-center justify-between"
                      >
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Studio Workspace Content Area */}
      <div>
        {previewMode ? (
          /* View 1: High-level Article Web Preview */
          <div className="w-full min-h-[500px] rounded-2xl border border-slate-800/80 bg-[#080a0f] p-6 sm:p-12 blog-article-content shadow-inner overflow-hidden relative">
            <div className="absolute top-0 right-0 px-4 py-1 bg-blue-500/10 border-b border-l border-slate-800 text-blue-400 text-[10px] font-mono font-bold uppercase rounded-bl-xl">
              WEB ARTICLE RENDERER
            </div>
            <ReactMarkdown>
              {content || '# No content generated yet...'}
            </ReactMarkdown>
          </div>
        ) : (
          /* View 2: Live Editable Content Input */
          <div className="relative">
            <div className="absolute top-3 right-4 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-bold uppercase rounded-xl pointer-events-none">
              STUDIO INTERACTIVE MODE
            </div>
            <textarea
              className="w-full min-h-[500px] rounded-2xl border border-slate-800 bg-[#080a0f] text-slate-100 p-8 pt-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm leading-relaxed placeholder-slate-600 shadow-inner resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onSelect={handleSelection}
              placeholder="Deploying raw AI markdown output..."
            />
          </div>
        )}
      </div>

      {/* Embedded Image Assets Gallery Tray */}
      {images?.length > 0 && (
        <div className="bg-[#0b0d14] border border-slate-800 rounded-2xl p-6 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Attached AI Image Assets</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">FITTED</span>
            </h4>
            <p className="text-[11px] text-slate-500">Perfectly scaled for live web & export formatting.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="group relative border border-slate-800 rounded-xl overflow-hidden bg-[#07090e] shadow-lg hover:border-cyan-500/50 transition-all">
                <img src={img.url} alt={img.alt || 'Blog asset'} className="w-full h-28 object-cover group-hover:scale-105 transition-all duration-300" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold truncate">{img.alt || `Asset #${idx + 1}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
