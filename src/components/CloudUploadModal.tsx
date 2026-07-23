import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, UploadCloud, FileText, Image as ImageIcon, ShieldCheck, 
  Trash2, Copy, Check, ExternalLink, Download, Sparkles, X, 
  Search, Filter, HardDrive, CheckCircle2, ArrowUpRight, Folder
} from 'lucide-react';
import { CloudFile } from '../types';
import { subscribeCloudFiles, uploadFileToGoogleCloud, deleteCloudFileFromFirestore, getOrInitUserId } from '../firebase';

interface CloudUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFileUrl?: (url: string) => void; // Optional callback when user picks an uploaded image/file URL
  userRole?: string;
  vendorId?: string;
}

const CATEGORIES: CloudFile['category'][] = [
  'Dish Image',
  'Catering Menu',
  'Permit & Insurance',
  'Venue Layout',
  'Event Specification',
  'General Document'
];

export default function CloudUploadModal({
  isOpen,
  onClose,
  onSelectFileUrl,
  userRole = 'Consumer',
  vendorId
}: CloudUploadModalProps) {
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CloudFile['category']>('Dish Image');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<CloudFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const userId = getOrInitUserId();

  // Subscribe to Google Cloud Files in Realtime
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeCloudFiles((files) => {
      setCloudFiles(files);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await processFileUpload(file);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFileUpload(file);
    }
  };

  const processFileUpload = async (file: File) => {
    // 15MB soft check for browser storage performance
    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please choose a smaller document or image.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 150);

    try {
      const uploaded = await uploadFileToGoogleCloud(
        file,
        selectedCategory,
        userId,
        userRole,
        vendorId,
        notesInput
      );

      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setNotesInput('');
        showToast(`"${file.name}" uploaded & saved to Google Cloud! ☁️`);

        // If a callback was provided to pick the URL
        if (onSelectFileUrl) {
          onSelectFileUrl(uploaded.dataUrl || uploaded.cloudUrl);
        }
      }, 400);
    } catch (error) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Upload failed. Please check internet connection and try again.');
    }
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Google Cloud Storage URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" from Google Cloud storage?`)) {
      await deleteCloudFileFromFirestore(id);
      showToast('File deleted from Google Cloud storage.');
    }
  };

  const filteredFiles = cloudFiles.filter((file) => {
    const matchesCategory = filterCategory === 'All' || file.category === filterCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (file.notes && file.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalBytes = cloudFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#7A0019] via-[#8A1029] to-[#5E0012] text-white p-5 sm:p-6 flex items-center justify-between shrink-0 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <Cloud className="w-56 h-56 text-white" />
            </div>

            <div className="flex items-center space-x-3.5 z-10">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#FFC72C] shadow-inner border border-white/20">
                <Cloud className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">Google Cloud Storage</h2>
                  <span className="bg-[#FFC72C] text-[#5E0012] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Live Cloud Sync
                  </span>
                </div>
                <p className="text-xs text-rose-100/90 font-medium mt-0.5 flex items-center space-x-2">
                  <span>Store party menus, COI permits, food photos & event specs</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-[#FFC72C] font-mono font-bold">{totalMB} MB Cloud Storage Used</span>
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="z-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Banner */}
          {toastMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#FFC72C] text-[#5E0012] px-4 py-2 text-xs font-bold text-center flex items-center justify-center space-x-2 shadow-inner"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{toastMsg}</span>
            </motion.div>
          )}

          {/* Main Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar">
            
            {/* Upload Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#7A0019] dark:hover:border-[#FFC72C] transition-all space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block font-mono mb-1">
                    Select Asset Category
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#7A0019] text-white shadow-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:w-64">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block font-mono mb-1">
                    Optional File Note / Tags
                  </label>
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="e.g. Summer 2026 COI Permit, Truffle Menu v2..."
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
                  />
                </div>
              </div>

              {/* Drag and Drop Area */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-200/80 dark:border-slate-800 hover:bg-rose-50/50 dark:hover:bg-slate-800/90 transition-all cursor-pointer group space-y-3 shadow-sm"
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  onChange={handleFileSelect}
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                  className="hidden" 
                />

                <div className="w-14 h-14 rounded-2xl bg-[#7A0019]/10 text-[#7A0019] dark:text-[#FFC72C] dark:bg-slate-800 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    Click or Drag & Drop File to Upload to Google Cloud
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports high-resolution images (PNG, JPG, WEBP), PDF Menus, COI Insurance Permits & Event Specifications
                  </p>
                </div>

                {isUploading && (
                  <div className="pt-2 space-y-1.5 max-w-xs mx-auto">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 font-mono">
                      <span>Transmitting to Google Cloud...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#7A0019] to-[#FFC72C] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Storage Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-[#7A0019] dark:text-[#FFC72C]" />
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                  Google Cloud File Repository ({filteredFiles.length})
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cloud files..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cloud Files Grid */}
            {filteredFiles.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-8 text-center border border-slate-200/80 dark:border-slate-800 space-y-2">
                <Folder className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-500">No cloud files found in Google Cloud Firestore repository.</p>
                <p className="text-[11px] text-slate-400">Upload your first menu document, permit, or dish photo using the dropzone above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredFiles.map((f) => {
                  const isImage = f.type.startsWith('image/') || f.dataUrl?.startsWith('data:image');

                  return (
                    <div 
                      key={f.id}
                      className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-3 flex flex-col justify-between hover:shadow-md transition-all space-y-3 relative group"
                    >
                      {/* Top Preview / Icon */}
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-600">
                          {isImage && f.dataUrl ? (
                            <img 
                              src={f.dataUrl} 
                              alt={f.name} 
                              className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => setPreviewFile(f)}
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-[#7A0019] dark:text-[#FFC72C]" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-50 text-[#7A0019] dark:bg-slate-700 dark:text-[#FFC72C] inline-block font-mono mb-1">
                            {f.category}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate" title={f.name}>
                            {f.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {(f.size / 1024).toFixed(1)} KB • {new Date(f.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {f.notes && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 line-clamp-2 font-serif">
                          “{f.notes}”
                        </p>
                      )}

                      {/* Cloud Link & Actions */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleCopyLink(f.cloudUrl, f.id)}
                          className="flex items-center space-x-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#7A0019] dark:hover:text-[#FFC72C] transition-colors cursor-pointer"
                        >
                          {copiedId === f.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Cloud URI</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center space-x-1">
                          {onSelectFileUrl && (
                            <button
                              onClick={() => {
                                onSelectFileUrl(f.dataUrl || f.cloudUrl);
                                showToast('Selected file for form input!');
                                onClose();
                              }}
                              className="text-[10px] font-bold bg-[#7A0019] text-white px-2 py-1 rounded-lg hover:bg-[#8A1029] active:scale-95 transition-all cursor-pointer"
                            >
                              Insert
                            </button>
                          )}

                          {f.dataUrl && (
                            <a
                              href={f.dataUrl}
                              download={f.name}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => handleDelete(f.id, f.name)}
                            className="p-1 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Google Cloud Firestore Encrypted Storage Active</span>
            </div>

            <button
              onClick={onClose}
              className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Close Cloud Explorer
            </button>
          </div>
        </motion.div>
      </div>

      {/* Image Fullscreen Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPreviewFile(null)}>
          <div className="max-w-3xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3 text-white border border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs">{previewFile.name}</span>
              <button onClick={() => setPreviewFile(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={previewFile.dataUrl} alt={previewFile.name} className="max-h-[70vh] w-auto mx-auto object-contain rounded-xl" />
            <p className="text-[11px] text-slate-400 font-mono text-center">{previewFile.cloudUrl}</p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
