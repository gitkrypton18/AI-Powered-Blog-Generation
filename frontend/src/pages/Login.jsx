import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      login(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090e] px-4 py-12 relative overflow-hidden">
      {/* 3D Galactic Background & Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep Space Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-cyan-600/15 rounded-full blur-[130px] animate-blob animation-delay-4000" />
        
        {/* High-tech Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,black,transparent)]" />
        
        {/* Floating Stars Layer */}
        <div className="absolute inset-0 animate-float-stars pointer-events-none">
          <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_10px_#60a5fa]" />
          <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_12px_#c084fc]" />
          <div className="absolute top-[45%] left-[10%] w-2.5 h-2.5 bg-cyan-300 rounded-full shadow-[0_0_15px_#22d3ee]" />
          <div className="absolute top-[60%] right-[15%] w-1.5 h-1.5 bg-pink-300 rounded-full shadow-[0_0_10px_#f472b6]" />
          <div className="absolute bottom-[20%] left-[25%] w-2 h-2 bg-blue-200 rounded-full shadow-[0_0_12px_#93c5fd]" />
          <div className="absolute bottom-[35%] right-[25%] w-2.5 h-2.5 bg-purple-200 rounded-full shadow-[0_0_15px_#e879f9]" />
          <div className="absolute top-[15%] right-[40%] w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
          <div className="absolute bottom-[15%] left-[45%] w-1.5 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_10px_#a5f3fc]" />
        </div>
      </div>

      <div className="relative w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: 3D Rocket Launching Visualizer */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">Next-Gen AI Blog Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
            Launch Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Content
            </span> Into Orbit.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-lg mb-10 leading-relaxed">
            Powered by LangChain.js & Groq Llama 3.3 70B. Experience sub-second inference, live editable studio reviews, and pristine cloud exports.
          </p>

          {/* Animated SVG Rocket Visual */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center pointer-events-none">
            {/* Glowing Backdrop Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-2xl animate-pulse-ring" />
            
            {/* Rocket Container */}
            <div className="relative z-10 animate-rocket">
              <svg className="w-48 h-48 drop-shadow-[0_10px_25px_rgba(59,130,246,0.5)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Rocket Body */}
                <path d="M13.62 3.19C13.23 2.72 12.65 2.5 12 2.5C11.35 2.5 10.77 2.72 10.38 3.19C8.38 5.61 7.23 9.4 7.03 13.62C7 13.97 7.15 14.31 7.42 14.53C7.68 14.74 8.04 14.81 8.36 14.71L10.76 13.91V16.5C10.76 17.19 11.32 17.75 12 17.75C12.68 17.75 13.24 17.19 13.24 16.5V13.91L15.64 14.71C15.96 14.81 16.32 14.74 16.58 14.53C16.85 14.31 17 13.97 16.97 13.62C16.77 9.4 15.62 5.61 13.62 3.19Z" fill="url(#rocketGrad)" />
                {/* Window */}
                <circle cx="12" cy="8.5" r="1.5" fill="#07090e" stroke="#60a5fa" strokeWidth="0.5" />
                {/* Left Fin */}
                <path d="M7.03 13.62C6.31 13.86 5.65 14.31 5.14 14.93C4.54 15.67 4.25 16.63 4.34 17.6C4.42 18.39 5.09 19 5.89 19H7.69C7.94 19 8.16 18.84 8.23 18.6L9.36 14.84L7.03 13.62Z" fill="#3b82f6" />
                {/* Right Fin */}
                <path d="M16.97 13.62C17.69 13.86 18.35 14.31 18.86 14.93C19.46 15.67 19.75 16.63 19.66 17.6C19.58 18.39 18.91 19 18.11 19H16.31C16.06 19 15.84 18.84 15.77 18.6L14.64 14.84L16.97 13.62Z" fill="#3b82f6" />
                
                {/* Animated Flame Exhaust */}
                <g className="animate-exhaust">
                  <path d="M10.25 18.25L11.5 22.5C11.65 23 12.35 23 12.5 22.5L13.75 18.25H10.25Z" fill="url(#flameGrad)" />
                  <path d="M11 18.25L11.75 21C11.85 21.3 12.15 21.3 12.25 21L13 18.25H11Z" fill="#fef08a" />
                </g>

                <defs>
                  <linearGradient id="rocketGrad" x1="12" y1="2.5" x2="12" y2="17.75" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#94a3b8" />
                  </linearGradient>
                  <linearGradient id="flameGrad" x1="12" y1="18.25" x2="12" y2="23" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f97316" />
                    <stop offset="1" stopColor="#eab308" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Premium Glassmorphic Login Card */}
        <div className="lg:col-span-6">
          <div className="glass-card rounded-2xl p-6 sm:p-10 relative overflow-hidden glass-card-hover">
            {/* Ambient Card Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
                <p className="text-slate-400 text-sm">Access your AI studio dashboard and continue generating.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-center gap-3 backdrop-blur-md animate-pulse">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full glass-input rounded-xl pl-12 pr-4 py-3.5 text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50"
                      placeholder="commander@galaxy.ai"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full glass-input rounded-xl pl-12 pr-4 py-3.5 text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 glass-button-primary rounded-xl font-bold text-sm tracking-wide uppercase shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Igniting Thrusters...</span>
                    </>
                  ) : (
                    <>
                      <span>Engage Dashboard</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-sm text-slate-400">
                <p>
                  New to the galaxy?{' '}
                  <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                    Initialize Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
