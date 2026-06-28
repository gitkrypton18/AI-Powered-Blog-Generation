import { useState } from 'react';
import { blogAPI } from '../api';

export default function ImageGallery({ blog, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleRemoveImage = async (index) => {
    if (!confirm('Permanently decommission this image asset from the blog instance?')) return;

    try {
      await blogAPI.removeImageFromBlog(blog.blogId, index);
      const updatedImages = (blog.images || []).filter((_, idx) => idx !== index);
      onUpdate({ ...blog, images: updatedImages });
    } catch (err) {
      console.error('Remove error:', err);
      alert('Failed to decommission image asset.');
    }
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('⚠️ Invalid format. Please deploy a standard image asset (PNG, JPG, WEBP).');
      event.target.value = '';
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('⚠️ Asset exceeds 10MB payload limit.');
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const response = await blogAPI.addImageToBlog(blog.blogId, dataUrl);
      if (response?.image) {
        const updatedImages = [...(blog.images || []), response.image];
        onUpdate({ ...blog, images: updatedImages });
      } else {
        throw new Error('No image confirmation returned from server.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown network error';
      alert(`❌ Failed to inject image asset: ${errorMessage}`);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-800/80 shadow-2xl relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>Studio Media Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Image Asset Studio ({blog.images?.length || 0})
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Deploy, inspect, and decommission visual elements for your active blog instance.
          </p>
        </div>

        <div>
          <label 
            htmlFor="image-upload-header" 
            className={`cursor-pointer px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2.5 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>{uploading ? 'Transmitting Asset...' : 'Deploy Image Asset'}</span>
          </label>
          <input
            id="image-upload-header"
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
        {blog.images?.map((image, index) => (
          <div key={index} className="border border-slate-800/80 rounded-2xl overflow-hidden bg-[#0a0c13] shadow-xl group hover:border-cyan-500/50 transition-all">
            <div className="relative aspect-video overflow-hidden bg-[#07090e]">
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-slate-700 rounded-full text-[10px] font-mono font-bold text-cyan-300 uppercase">
                Asset #{index + 1}
              </div>
            </div>
            <div className="p-5 bg-[#0b0e17] border-t border-slate-800/80 flex items-center justify-between">
              <div className="truncate pr-4">
                <div className="text-xs font-bold text-white uppercase tracking-wide truncate">{image.alt || `AI Synthesized Image #${index + 1}`}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">High-Res Web Optimized</div>
              </div>
              <button
                onClick={() => handleRemoveImage(index)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex-shrink-0"
              >
                Decommission
              </button>
            </div>
          </div>
        ))}

        {(!blog.images || blog.images.length === 0) && (
          <div className="col-span-2 p-12 rounded-2xl border-2 border-dashed border-slate-800 bg-[#0b0d14] text-center text-slate-500 flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white tracking-tight mb-1">No AI Image Assets Initialized</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Click "Deploy Image Asset" above to inject high-res visual payloads into your active blog instance.</p>
            </div>
          </div>
        )}
      </div>

      {/* Drag & Drop Upload Portal Footer */}
      <div className="border-t border-slate-800/80 pt-8 relative z-10">
        <div className="p-8 rounded-2xl bg-[#0b0d14] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hidden sm:flex">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white tracking-tight">Direct Asset Transmit Portal</h4>
              <p className="text-xs text-slate-400 mt-0.5">Supports PNG, JPG, WEBP formats up to 10MB per payload.</p>
            </div>
          </div>

          <label 
            htmlFor="image-upload-footer" 
            className={`cursor-pointer px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex-shrink-0 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Uploading Asset...' : 'Initialize File Explorer'}
          </label>
          <input
            id="image-upload-footer"
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
            disabled={uploading}
          />
        </div>
      </div>
    </div>
  );
}
