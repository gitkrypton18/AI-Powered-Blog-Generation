import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import BlogGenerator from '../components/BlogGenerator';
import RichTextEditor from '../components/RichTextEditor';
import ImageGallery from '../components/ImageGallery';
import Export from '../components/Export';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [currentBlog, setCurrentBlog] = useState(null);
  const [showImageGallery, setShowImageGallery] = useState(false);

  const handleBlogGenerated = (blogData) => {
    setCurrentBlog(blogData);
    setShowImageGallery(false);
  };

  const handleBlogUpdate = (updatedBlog) => {
    setCurrentBlog(updatedBlog);
  };

  const handleNewBlog = () => {
    if (confirm('Start a new blog? Current changes will be lost.')) {
      setCurrentBlog(null);
      setShowImageGallery(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-[35rem] h-[35rem] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-3000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-slate-950/40 backdrop-blur-md sticky top-0 z-40 border-b border-slate-800/60 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                AI Blog Generator
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Welcome, <span className="text-slate-300 font-semibold">{user?.name || user?.email}</span></p>
            </div>
            <div className="flex gap-3">
              {currentBlog && (
                <>
                  <button
                    onClick={() => setShowImageGallery(!showImageGallery)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer ${
                      showImageGallery 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800'
                    }`}
                  >
                    {showImageGallery ? 'Hide' : 'Manage'} Images
                  </button>
                  <button
                    onClick={handleNewBlog}
                    className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-855 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer"
                  >
                    New Blog
                  </button>
                </>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-gradient-to-r from-red-600/90 to-pink-600/90 hover:from-red-650 hover:to-pink-650 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-red-500/10 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!currentBlog ? (
            <BlogGenerator onBlogGenerated={handleBlogGenerated} />
          ) : (
            <div className="space-y-6">
              <RichTextEditor 
                blog={currentBlog} 
                onUpdate={handleBlogUpdate}
                images={currentBlog.images}
              />

              <Export blog={currentBlog} editorContent={currentBlog?.content} />

              {showImageGallery && (
                <ImageGallery blog={currentBlog} onUpdate={handleBlogUpdate} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
