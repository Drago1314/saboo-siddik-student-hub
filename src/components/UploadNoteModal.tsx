import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadNoteModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState(6);
  const [department, setDepartment] = useState('IoT');
  const [tags, setTags] = useState('');

  const DEPARTMENTS = ['IoT', 'Computer', 'AI-DS', 'Mechanical', 'Civil', 'Electronics'];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !auth.currentUser) return;

    setLoading(true);
    try {
      // 1. Upload File to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('notes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL from Supabase
      const { data: { publicUrl } } = supabase.storage
        .from('notes')
        .getPublicUrl(fileName);

      // 3. Save Metadata to Firebase Firestore
      await addDoc(collection(db, 'notes'), {
        title,
        subject,
        semester: Number(semester),
        department,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        fileURL: publicUrl,
        fileName: file.name,
        author: auth.currentUser.displayName || 'Admin',
        authorEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      onSuccess();
      onClose();
      // Reset form
      setFile(null);
      setTitle('');
      setSubject('');
      setTags('');
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Upload Notes</h2>
                <p className="text-sm font-medium text-slate-400">Share knowledge with the community</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="flex-1 overflow-y-auto p-8 pt-4 space-y-6 custom-scrollbar">
              {/* File Dropzone */}
              <div className="relative">
                <input 
                  type="file" 
                  id="note-file"
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <label 
                  htmlFor="note-file"
                  className={cn(
                    "cursor-pointer flex flex-col items-center justify-center py-10 border-4 border-dashed rounded-[2rem] transition-all",
                    file 
                      ? "border-green-100 bg-green-50/50 text-green-600" 
                      : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-blue-200 hover:bg-blue-50/50"
                  )}
                >
                  {file ? (
                    <>
                      <CheckCircle2 className="w-12 h-12 mb-2" />
                      <span className="font-bold text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-[10px] uppercase font-black tracking-widest mt-1">Change File</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mb-2 opacity-20" />
                      <span className="font-bold text-sm uppercase tracking-wider">Select Doc/PDF</span>
                    </>
                  )}
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Unit 1: OS Basics"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-4 focus:bg-white focus:border-blue-500/20 outline-none transition-all font-medium text-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Operating Systems"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-4 focus:bg-white focus:border-blue-500/20 outline-none transition-all font-medium text-sm"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Semester</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-4 focus:bg-white focus:border-blue-500/20 outline-none transition-all font-medium text-sm appearance-none"
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                  >
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
                  <select 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-4 focus:bg-white focus:border-blue-500/20 outline-none transition-all font-medium text-sm appearance-none"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tags (comma sep)</label>
                <input 
                  type="text" 
                  placeholder="OS, Notes, Exam"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3 px-4 focus:bg-white focus:border-blue-500/20 outline-none transition-all font-medium text-sm"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !file}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    CONFIRM UPLOAD
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
