import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Search, Plus, Download, Trash2, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UploadNoteModal from './UploadNoteModal';
import { cn } from '../lib/utils';

export interface Note {
  id: string;
  title: string;
  subject: string;
  semester: number;
  department: string;
  tags: string[];
  fileURL: string;
  fileName: string;
  author: string;
  createdAt: any;
}

interface Props {
  isAdmin?: boolean;
  externalSearch?: string;
  showOnlyMyNotes?: boolean;
}

export default function NotesRepo({ isAdmin, externalSearch = '', showOnlyMyNotes = false }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSem, setSelectedSem] = useState<number | 'All'>(6);
  const [selectedDept, setSelectedDept] = useState<string | 'All'>('IoT');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const DEPARTMENTS = ['IoT', 'Computer', 'AI-DS', 'Mechanical', 'Civil', 'Electronics'];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      alert('Failed to delete note');
    }
  };

  const filteredNotes = notes.filter(n => {
    const combinedSearch = (search + " " + externalSearch).toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(combinedSearch.trim()) || 
                          n.subject.toLowerCase().includes(combinedSearch.trim());
    const matchesSem = selectedSem === 'All' || n.semester === selectedSem;
    const matchesDept = selectedDept === 'All' || n.department === selectedDept;
    
    // My Locker filtering
    const matchesAuthor = !showOnlyMyNotes || n.author === auth.currentUser?.email;
    
    return matchesSearch && matchesSem && matchesDept && matchesAuthor;
  });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-800">Notes Box</h2>
          <p className="text-slate-500 font-medium mt-1">Verified study material for Saboo Siddik Students.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search repository..."
              className="pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500/20 text-sm font-medium w-48 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-500/20 shadow-sm appearance-none cursor-pointer pr-10 relative"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.8rem' }}
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value === 'All' ? 'All' : Number(e.target.value))}
          >
            <option value="All">All Sems</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>

          <select 
            className="px-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-blue-500/20 shadow-sm appearance-none cursor-pointer pr-10 relative capitalize"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '0.8rem' }}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">All Depts</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {isAdmin && (
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              UPLOAD
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 rounded-[2.5rem] bg-white border-2 border-slate-50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNotes.map(note => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] group-hover:bg-blue-50 transition-colors -z-0 opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-white group-hover:shadow-lg group-hover:shadow-slate-200/50 transition-all">
                      {note.fileName.endsWith('.pdf') ? '📕' : '📄'}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex gap-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                          S{note.semester}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-purple-600 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                          {note.department}
                        </span>
                       </div>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDelete(note.id)}
                          className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-exrabold text-slate-800 text-xl leading-[1.1] mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.2rem]">
                    {note.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{note.subject}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {note.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-tighter">
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length === 0 && <span className="opacity-0">.</span>}
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {note.author[0]}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[80px]">
                        {note.author}
                      </span>
                    </div>
                    <a 
                      href={note.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-50 hover:bg-slate-900 hover:text-white p-3 rounded-2xl transition-all shadow-inner group/btn"
                    >
                      <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {!loading && filteredNotes.length === 0 && (
            <div className="col-span-full py-32 text-center bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-100">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-400">NO NOTES FOUND</p>
              <p className="text-sm text-slate-300 font-medium">Be the first to contribute to this semester.</p>
              {isAdmin && (
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mt-6 text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                >
                  + UPLOAD NOW
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <UploadNoteModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchNotes}
      />
    </div>
  );
}
