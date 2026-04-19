import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  LayoutDashboard, 
  Search, 
  Settings,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NotesRepo from './components/NotesRepo';
import AIOracle from './components/AIOracle';
import Login from './components/Login';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { cn } from './lib/utils';

type View = 'dashboard' | 'notes' | 'oracle' | 'settings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMyNotes, setShowOnlyMyNotes] = useState(false);

  // Admin emails - Add your email here
  const ADMIN_EMAILS = [
    'shaikhmirza03@gmail.com', 
    'admin@mhssce.ac.in',
    'faazil.231849.ci@mhssce.ac.in'
  ];
  const isAdmin = user && (ADMIN_EMAILS.includes(user.email || ''));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Notes Box', icon: BookOpen },
    { id: 'oracle', label: 'AI Oracle', icon: Sparkles },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:relative z-50 h-full bg-white border-r border-zinc-200 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              {sidebarOpen && (
                <div className="leading-tight">
                  <h1 className="font-bold text-sm tracking-tight text-zinc-900">MHS Siddik</h1>
                  <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Student Hub</p>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as View)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-blue-50 text-blue-600 shadow-sm" 
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-zinc-400 group-hover:text-zinc-900")} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-zinc-100 flex flex-col gap-2">
            <button 
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all",
                !sidebarOpen && "justify-center px-0"
              )}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-zinc-100 text-zinc-400"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-4 group flex-1 max-w-md ml-8">
            <div className="p-2 bg-zinc-100 rounded-lg group-focus-within:bg-blue-50 transition-colors">
              <Search className="w-4 h-4 text-zinc-400 group-focus-within:text-blue-600" />
            </div>
            <input 
              type="text" 
              placeholder="Quick search anything..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'notes') setActiveView('notes');
              }}
              className="bg-transparent border-none outline-none text-sm text-zinc-900 placeholder:text-zinc-400 w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => alert("You are all caught up! No new notifications.")}
              className="p-2 relative text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-100">
               <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-zinc-900">{user.displayName || 'Student'}</p>
                 <p className="text-[10px] text-zinc-400 font-medium">{isAdmin ? 'ADMIN ACCESS' : 'STUDENT'}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white shadow-sm overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                 {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_1fr_1fr] gap-5 h-full max-h-[1200px]">
                  {/* Header Card */}
                  <div className="md:col-span-3 bento-card bg-ss-blue text-white border-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                        <GraduationCap className="w-8 h-8 text-ss-blue" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">SABOO SIDDIK STUDENT HUB</h1>
                        <p className="text-blue-200 text-sm font-medium">Engineering Excellence | MHSSCE Dashboard</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-blue-300 uppercase font-black tracking-widest mb-1">Oracle Status</p>
                        <p className="text-sm font-mono bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30">Gemini 1.5 Flash: ONLINE</p>
                      </div>
                    </div>
                  </div>

                  {/* Oracle Card (Left Column, spans 2 rows) */}
                  <div className="md:row-span-2 bento-card bg-[#111827] border-[#064e3b] text-[#10b981] overflow-hidden flex flex-col">
                    <AIOracle minimal />
                  </div>

                  {/* Notes Card (Top Right Area) */}
                  <div className="md:col-span-2 bento-card flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-800">Verified Repository</h2>
                      <div className="flex gap-2">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">LATEST</span>
                        <button 
                          onClick={() => setActiveView('notes')}
                          className="bg-ss-gold text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-amber-700 transition-colors"
                        >
                          OPEN BOX
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center text-center p-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                      <div>
                        <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400">ACCESS REAL-TIME REPOSITORY</p>
                        <button 
                          onClick={() => setActiveView('notes')}
                          className="mt-4 text-xs font-black text-blue-600 hover:underline"
                        >
                          GO TO NOTES BOX →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stats Card */}
                  <div className="bento-card">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">Quick Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-xs text-slate-600">Centralized Cloud Storage Active</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-xs text-slate-600">AI Oracle connected via API</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile/Locker Card */}
                  <div className="bento-card flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl shadow-inner border border-white uppercase">
                      {user.displayName?.[0] || 'S'}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{user.displayName || 'Student User'}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono italic truncate max-w-full px-4">{user.email}</p>
                    <button 
                      onClick={() => {
                        setShowOnlyMyNotes(true);
                        setActiveView('notes');
                      }}
                      className="mt-2 w-full bg-ss-gold text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-amber-700/20 hover:-translate-y-0.5 transition-all active:scale-95"
                    >
                      {isAdmin ? 'ADMIN DASHBOARD' : 'VIEW MY LOCKER'}
                    </button>
                  </div>
                </div>
              )}

              {activeView === 'notes' && (
                <NotesRepo 
                  isAdmin={isAdmin} 
                  externalSearch={searchQuery}
                  showOnlyMyNotes={showOnlyMyNotes}
                />
              )}
              {activeView === 'oracle' && <AIOracle />}
              
              {activeView === 'settings' && (
                <div className="max-w-xl mx-auto py-12">
                  <div className="flex items-center gap-6 mb-12">
                     <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl">
                       {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                     </div>
                     <div>
                       <h3 className="text-3xl font-black text-slate-800">{user.displayName || 'Saboo Siddik Student'}</h3>
                       <p className="text-slate-500 font-medium">{user.email}</p>
                       <div className="flex gap-2 mt-2">
                         <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                           {isAdmin ? 'ADMIN ACCESS' : 'STUDENT'}
                         </span>
                         <span className="bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200">
                           SEM 6 IOT
                         </span>
                       </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account Settings</h4>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-red-500/20 group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                          <LogOut className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-800">Disconnect Session</p>
                          <p className="text-xs text-slate-400">Logout from your account securely</p>
                        </div>
                      </div>
                      <X className="w-5 h-5 text-slate-300 group-hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
