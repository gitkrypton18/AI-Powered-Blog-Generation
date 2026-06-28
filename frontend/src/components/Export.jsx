import { useState } from 'react';
import { blogAPI } from '../api';

export default function Export({ blog, editorContent }) {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [error, setError] = useState('');

  const handleExport = async (format) => {
    setExporting(true);
    setError('');
    setExportFormat(format);

    try {
      const payload = {
        content: editorContent,
        title: blog.title,
        blogId: blog.blogId,
        images: (blog?.images || []).map((img, index) => ({
          url: img.url,
          alt: img.alt || `Image ${index + 1}`
        }))
      };

      let response;

      switch (format) {
        case 'pdf':
          response = await blogAPI.exportToPDF(payload);
          break;
        case 'docx':
          response = await blogAPI.exportToDOCX(payload);
          break;
        default:
          throw new Error('Unknown export format');
      }

      if (response.data) {
        downloadFile(response.data, format);
      }
    } catch (err) {
      setError(`Failed to export as ${format.toUpperCase()}: ${err.response?.data?.message || err.message}`);
    } finally {
      setExporting(false);
      setExportFormat(null);
    }
  };

  const downloadFile = (data, format) => {
    let blob;
    let filename;

    const mimeTypes = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    const extensions = {
      pdf: 'pdf',
      docx: 'docx'
    };

    if (data instanceof Blob) {
      blob = data;
    } else if (typeof data === 'string') {
      blob = new Blob([data], { type: mimeTypes[format] || 'text/plain' });
    } else if (data.file) {
      blob = new Blob([data.file], { type: mimeTypes[format] || 'text/plain' });
    } else {
      throw new Error('Invalid file data format');
    }

    filename = `${blog.title || 'blog'}.${extensions[format]}`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportOptions = [
    { format: 'pdf', label: 'Export as PDF', icon: '📄', className: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg shadow-red-500/10 hover:shadow-red-500/20' },
    { format: 'docx', label: 'Export as Word (DOCX)', icon: '📝', className: 'bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-550 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20' }
  ];

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">📥 Export Blog Post</h3>
        <p className="text-xs text-slate-400 mt-1">Download your article as a PDF or DOCX file with images embedded.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800/40 text-red-200 rounded-xl text-sm flex items-start gap-3 shadow-lg">
          <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        {exportOptions.map((option) => (
          <button
            key={option.format}
            onClick={() => handleExport(option.format)}
            disabled={exporting}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${option.className}`}
          >
            <span>{option.icon} {option.label}</span>
            {exporting && exportFormat === option.format && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
