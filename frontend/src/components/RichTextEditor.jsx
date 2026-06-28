import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { blogAPI } from '../api';

const TONES = [
  { value: 'professional', label: '💼 Professional' },
  { value: 'fun', label: '🎉 Fun / Casual' },
  { value: 'concise', label: '📝 Concise / Direct' }
];

export default function RichTextEditor({ blog, onUpdate, images }) {
  const [content, setContent] = useState(blog.content);
  const [selectedText, setSelectedText] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
      alert('Blog saved successfully!');
    } catch (err) {
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleTextAction = async (action, tone = null) => {
    if (!selectedText || selectedText.length < 10) {
      alert('Please select at least 10 characters of text');
      return;
    }

    setProcessing(true);
    setShowToneMenu(false);

    try {
      let response;
      
      switch (action) {
        case 'rewrite':
          response = await blogAPI.rewriteText(blog.blogId, selectedText, blog.tone);
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
      }

    } catch (err) {
      alert('Failed to process text');
    } finally {
      setProcessing(false);
      setShowToneMenu(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">📝 Edit Blog Post</h3>
          <p className="text-xs text-slate-400 mt-1">Select text to access AI editing actions.</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 rounded-xl font-semibold text-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            {previewMode ? (
              <>
                <span>✏️</span>
                <span>Edit Mode</span>
              </>
            ) : (
              <>
                <span>👁️</span>
                <span>Preview Mode</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-550 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-550/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Toolbar when selecting text */}
      {hasSelection && (
        <div className="bg-slate-950/90 border border-blue-500/30 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex flex-wrap items-center gap-2 animate-fade-in relative z-25">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs text-blue-400 font-semibold tracking-wide uppercase">AI Assistant:</span>
          </div>

          <button
            onClick={() => handleTextAction('rewrite')}
            disabled={processing}
            className="px-3.5 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/30 hover:border-transparent rounded-xl font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {processing ? 'Working...' : '🔄 Rewrite'}
          </button>
          
          <button
            onClick={() => handleTextAction('improveSEO')}
            disabled={processing}
            className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/30 hover:border-transparent rounded-xl font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {processing ? 'Working...' : '🔍 Improve SEO'}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowToneMenu((v) => !v)}
              disabled={processing}
              className="px-3.5 py-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 hover:border-transparent rounded-xl font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {processing ? 'Working...' : '🎨 Change Tone'}
            </button>
            {showToneMenu && (
              <div className="absolute right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-3 w-56 z-50 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">Select Tone</div>
                {TONES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => handleTextAction('changeTone', t.value)}
                    disabled={processing}
                    className="w-full text-left px-3 py-2 text-slate-350 hover:bg-slate-900 hover:text-white rounded-lg transition-colors font-medium text-xs cursor-pointer"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor Main Content Area */}
      <div>
        {previewMode ? (
          <div className="w-full min-h-[450px] rounded-xl border border-slate-800 bg-slate-950/20 p-6 md:p-8 text-slate-200 overflow-y-auto max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-extrabold text-white mb-6 pb-2 border-b border-slate-800/80 tracking-tight" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold text-blue-400 mt-8 mb-4 tracking-tight" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold text-purple-400 mt-6 mb-3 tracking-tight" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 text-slate-300 leading-relaxed text-justify" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-300" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-slate-300 leading-relaxed" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-white" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic text-slate-200" {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="my-6 border-t border-slate-800" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-purple-500 pl-4 italic text-slate-400 my-4 bg-slate-950/30 py-2 pr-4 rounded-r-lg" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="w-full min-h-[450px] rounded-xl border border-slate-800 bg-slate-950/80 text-slate-100 p-5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-sm placeholder-slate-650 leading-relaxed resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleSelection}
            placeholder="Write your content here..."
          />
        )}
      </div>

      {/* Embedded Images Panel */}
      {images?.length > 0 && (
        <div className="border-t border-slate-800/80 pt-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <span>🖼️</span> Generated Images Collection
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="group border border-slate-800/85 rounded-xl overflow-hidden shadow-md bg-slate-950/40 relative">
                <img 
                  src={img.url} 
                  alt={img.prompt || 'Blog image'} 
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
