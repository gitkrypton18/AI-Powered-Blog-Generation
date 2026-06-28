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
      setError(`Failed to compile ${format.toUpperCase()} payload: ${err.response?.data?.message || err.message}`);
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
      throw new Error('Invalid file data structure');
    }

    filename = `${blog.title || 'ai-blog-instance'}.${extensions[format]}`;

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
    { format: 'pdf', label: 'High-Fidelity PDF', icon: '📄', desc: 'Synthesized via cloud Puppeteer & pdfmake engines', color: 'pink' },
    { format: 'docx', label: 'Microsoft Word (DOCX)', icon: '📝', desc: 'Pragmatic document structure with native image embedding', color: 'blue' }
  ];

  return (
    <div className="relative z-10">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[11px] font-bold uppercase tracking-wider text-pink-400 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            <span>Production Export Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Compile & Download Document Payloads
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Deploy pristine formatted documents complete with your live review modifications and embedded image assets.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-center gap-3 backdrop-blur-md animate-pulse">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Export Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {exportOptions.map((option) => (
          <div key={option.format} className="p-6 rounded-2xl bg-[#0b0d14] border border-slate-800 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-pink-500/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{option.icon}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono font-bold uppercase">CLOUD READY</span>
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-tight mb-1">{option.label}</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">{option.desc}</p>
            </div>

            <button
              onClick={() => handleExport(option.format)}
              disabled={exporting}
              className={`w-full py-4 bg-gradient-to-r ${option.format === 'pdf' ? 'from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-[0_0_20px_rgba(244,114,182,0.3)]' : 'from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'} text-white rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
            >
              {exporting && exportFormat === option.format ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>COMPILING PAYLOAD...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>COMPILE & DOWNLOAD {option.format.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Cloud Engine Telemetry Note */}
      <div className="p-6 rounded-2xl bg-[#080a0f] border border-slate-800/80 flex items-center justify-between gap-4 text-xs text-slate-400 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-slate-300">COMPILER ORCHESTRATION STATUS</span>
        </div>
        <span className="font-mono text-emerald-400 font-bold">ALL SYSTEMS NOMINAL</span>
      </div>
    </div>
  );
}
