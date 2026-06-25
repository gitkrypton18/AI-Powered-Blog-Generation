import { useState } from 'react';
import { blogAPI } from '../api';

const TONES = [
  { value: 'professional', label: '💼 Professional' },
  { value: 'fun', label: '🎉 Fun / Casual' },
  { value: 'concise', label: '📝 Concise / Direct' }
];

export default function BlogGenerator({ onBlogGenerated }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await blogAPI.generateBlog(topic, tone, 'text');
      if (response?.data) {
        onBlogGenerated(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl p-8 mb-8 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Waves */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path className="animate-wave" fill="#3b82f6" fillOpacity="0.2" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg className="absolute bottom-0 w-full h-full animation-delay-2000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path className="animate-wave" fill="#8b5cf6" fillOpacity="0.15" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Rotating Geometric Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 border-4 border-blue-500/10 rounded-lg opacity-20 animate-spin-slow"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 border-4 border-purple-500/10 rounded-full opacity-20 animate-spin-slow animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-indigo-500/10 opacity-20 animate-bounce-slow"></div>
        
        {/* Gradient Orbs with Scale Animation */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full opacity-25 animate-scale-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full opacity-20 animate-scale-pulse animation-delay-2000"></div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-white relative z-10 tracking-tight">
        ✨ Generate New Blog
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800/40 text-red-200 rounded-xl relative z-10 text-sm flex items-start gap-3 shadow-lg">
          <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Blog Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 border border-slate-800 bg-slate-950/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent placeholder-slate-650 transition duration-200"
            placeholder="e.g., The Future of Artificial Intelligence in Education"
            disabled={loading}
            maxLength={200}
          />
          <div className="flex justify-end mt-1">
            <p className="text-xs text-slate-500">
              {topic.length}/200 characters
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Writing Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-3 border border-slate-800 bg-slate-950/80 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition duration-200 cursor-pointer"
            disabled={loading}
          >
            {TONES.map((t) => (
              <option key={t.value} value={t.value} className="bg-slate-950 text-white">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-650 hover:from-blue-500 hover:to-purple-550 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/10 cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating Blog (this may take up to 30 seconds)...</span>
            </>
          ) : (
            <>
              <span>Generate Blog</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
