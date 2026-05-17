import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LayoutDashboard, CalendarDays, ShieldCheck, MessageSquare, BarChart2, LogOut, Bell, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import api from '../utils/axios';

export default function Layout({ children }) {
  const router = useRouter();
  const { workspaceId } = router.query;
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    fetchWorkspaces();
    fetchDeadlines();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/user/workspaces');
      if (res.data.success) setWorkspaces(res.data.payload);
    } catch (err) {}
  };

  const fetchDeadlines = async () => {
    try {
      const res = await api.get('/user/deadlines?days=3');
      if (res.data.success) setNotifications(res.data.payload);
    } catch (err) {}
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const currentWs = workspaces.find(w => w.custom_url === workspaceId);

  const menuItems = [
    { id: 'tasks', path: `/w/${workspaceId}/tasks`, icon: LayoutDashboard, label: 'My Tasks' },
    { id: 'calendar', path: `/w/${workspaceId}/calendar`, icon: CalendarDays, label: 'Calendar' },
    { id: 'discuss', path: `/w/${workspaceId}/discuss`, icon: MessageSquare, label: 'Discuss' },
    { id: 'roles', path: `/w/${workspaceId}/roles`, icon: ShieldCheck, label: 'Roles & Access' },
    { id: 'stats', path: `/w/${workspaceId}/stats`, icon: BarChart2, label: 'Stats' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F7F3] overflow-hidden p-4 gap-4">
      {/* SIDEBAR GELA LENGKUNG */}
      <aside className="w-64 bg-[#111] text-gray-400 flex flex-col rounded-[2.5rem] shadow-2xl p-6">
        <div className="p-4 text-white font-bold text-3xl tracking-tighter mb-10">Taskly.</div>
        
        <div className="mb-12">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4 px-4">Workspaces</div>
          {workspaces.map(ws => (
            <Link key={ws.workspace_id} href={`/w/${ws.custom_url}/tasks`} className={`block p-4 rounded-2xl mb-2 transition-all ${workspaceId === ws.custom_url ? 'bg-[#222] text-white border border-gray-700' : 'hover:bg-[#1A1A1A]'}`}>
              <div className="text-sm font-semibold truncate">{ws.name}</div>
              <div className="text-[10px] text-gray-500 capitalize">{ws.role_name}</div>
            </Link>
          ))}
          <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed border-gray-700 rounded-xl text-[10px] font-bold hover:bg-[#1A1A1A] mt-3">
            <Plus size={14}/> NEW WORKSPACE
          </button>
        </div>

        <nav className="flex-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4 px-4">Menu</div>
          {workspaceId && menuItems.map(item => (
            <Link key={item.id} href={item.path} className={`flex items-center gap-3 px-5 py-4 rounded-3xl mb-1.5 transition-all ${router.pathname.includes(item.id) ? 'bg-white text-black font-bold shadow-lg' : 'hover:text-white'}`}>
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* AREA UTAMA & TOPBAR CLEAN */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
        <header className="flex items-center justify-between px-12 py-8 border-b border-gray-100">
          <h1 className="text-3xl font-extrabold text-gray-900 capitalize tracking-tight flex items-center gap-3">
            <Users size={24} className="text-blue-600"/>
            {currentWs ? currentWs.name : 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4 relative">
            <button onClick={() => setShowNotif(!showNotif)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 relative group">
              <Bell size={20} className="text-gray-500 group-hover:text-black" />
              {notifications.length > 0 && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white animate-pulse"></span>}
            </button>
            
            {showNotif && (
              <div className="absolute top-16 right-16 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50">
                <h4 className="font-bold text-sm mb-4">Tenggat Waktu Mendatang</h4>
                <div className="space-y-3">
                  {notifications.slice(0, 3).map(n => (
                    <div key={n.task_id} className="p-3 bg-red-50 text-red-800 rounded-xl text-xs font-semibold">
                      {n.title} - {new Date(n.due_date).toLocaleDateString('id-ID')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 bg-white rounded-full p-1.5 pr-5 border border-gray-100 cursor-pointer hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-inner">
                {user ? user.full_name.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <span className="text-sm font-semibold text-gray-700 tracking-tight">{user ? user.full_name : 'User'}</span>
            </div>

            {showProfile && (
              <div className="absolute top-16 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
                <button onClick={handleLogout} className="w-full text-left px-4 py-3.5 text-sm text-red-500 hover:bg-red-50 rounded-xl font-bold flex items-center gap-2.5 transition">
                  <LogOut size={16}/> Keluar
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-12 py-10">
          {children}
        </section>
      </main>
    </div>
  );
}