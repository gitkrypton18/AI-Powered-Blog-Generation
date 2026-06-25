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
    if (!confirm('Remove this image?')) return;

    try {
      await blogAPI.removeImageFromBlog(blog.blogId, index);
      const updatedImages = (blog.images || []).filter((_, idx) => idx !== index);
      onUpdate({ ...blog, images: updatedImages });
    } catch (err) {
      console.error('Remove error:', err);
      alert('Failed to remove image');
    }
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      event.target.value = '';
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('Image size must be less than 10MB');
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
        throw new Error('No image returned from server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      alert(`Failed to upload image: ${errorMessage}`);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl p-6 md:p-8 mt-8">
      <h2 className="text-xl font-bold mb-6 text-white tracking-tight">
        🖼️ Blog Images ({blog.images?.length || 0})
      </h2>

      {blog.images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          {blog.images.map((image, index) => (
            <div key={index} className="border border-slate-800/80 bg-slate-950/40 rounded-xl overflow-hidden shadow-lg hover:border-slate-700/80 transition-all group">
              <div className="relative overflow-hidden">
                <img
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/60">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-red-600/90 to-pink-650/90 hover:from-red-600 hover:to-pink-650 text-white rounded-lg font-semibold transition-all shadow-md shadow-red-500/10 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Delete Image
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-slate-800/80 pt-6">
        <h3 className="text-lg font-bold text-white mb-3 tracking-tight">📤 Upload New Image</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <label 
            htmlFor="image-upload" 
            className={`cursor-pointer px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-650 hover:from-blue-500 hover:to-purple-550 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-500/10 inline-block transition-all hover:scale-[1.01] active:scale-[0.99] ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Choose File'}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
            disabled={uploading}
          />
          <p className="text-xs text-slate-400">Select any JPEG/PNG image file to enrich your article.</p>
        </div>
      </div>
    </div>
  );
}
