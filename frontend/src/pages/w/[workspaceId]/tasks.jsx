import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Plus, Pin, CheckCircle2, Circle, X, Trash2, CalendarClock, Clock, AlertTriangle } from 'lucide-react';
import api from '@/utils/axios';

export default function Tasks() {
  const router = useRouter();
  const { workspaceId } = router.query;
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [color, setColor] = useState('yellow');

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceAndTasks();
    }
  }, [workspaceId]);

  const fetchWorkspaceAndTasks = async () => {
    try {
      const wsRes = await api.get(`/workspace/url/${workspaceId}`);
      if (wsRes.data.success) {
        const ws = wsRes.data.payload;
        setWorkspace(ws);
        const taskRes = await api.get(`/task/${ws.workspace_id}`);
        if (taskRes.data.success) setTasks(taskRes.data.payload);
      }
    } catch (err) {}
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/task/${workspace.workspace_id}`, {
        title, description, due_date: dueDate, priority, color, is_pinned: false
      });
      if (res.data.success) {
        fetchWorkspaceAndTasks();
        setShowModal(false);
        setTitle(''); setDescription(''); setDueDate('');
      }
    } catch (err) {}
  };

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await api.put(`/task/${workspace.workspace_id}/${task.task_id}`, { status: newStatus });
      fetchWorkspaceAndTasks();
    } catch (err) {}
  };

  const togglePin = async (task) => {
    try {
      await api.put(`/task/${workspace.workspace_id}/${task.task_id}`, { is_pinned: !task.is_pinned });
      fetchWorkspaceAndTasks();
    } catch (err) {}
  };

  const handleDeleteTask = async (taskId) => {
    if(!window.confirm("Hapus tugas ini?")) return;
    try {
      await api.delete(`/task/${workspace.workspace_id}/${taskId}`);
      fetchWorkspaceAndTasks();
    } catch (err) {}
  };

  const pinnedTasks = tasks.filter(t => t.is_pinned);
  const unpinnedTasks = tasks.filter(t => !t.is_pinned);

  // Fungsi untuk mendapatkan warna pastel badge prioritas
  const getPriorityBadge = (p) => {
    const styles = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return styles[p] || 'bg-gray-100 text-gray-700';
  }

  return (
    <Layout>
      <div className="h-full">
        {/* HEADER AREA */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3 bg-gray-50 border px-6 py-3 rounded-full shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={14}/> {pinnedTasks.length} Pinned • {unpinnedTasks.length} Total Tugas
            </h2>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-7 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition">
            <Plus size={16}/> NEW TASK
          </button>
        </div>

        {/* PINNED SECTION (POST-IT MODERN) */}
        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pinnedTasks.map(task => (
              <div key={task.task_id} className="bg-[#FFF3C7] rounded-[2.5rem] p-8 shadow-md border border-[#F0B429]/20 flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-[2.5rem] group-hover:bg-white/30 transition"></div>
                <div>
                  <h3 className="font-extrabold text-gray-950 text-xl mb-3 leading-tight truncate">{task.title}</h3>
                  <p className="text-sm text-gray-700 mb-8 font-medium leading-relaxed">{task.description}</p>
                </div>
                <div className="flex justify-between items-center mt-auto border-t border-[#F0B429]/30 pt-6">
                  <span className="text-[10px] font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                    <Clock size={12}/> DUE TODAY
                  </span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleStatus(task)}>{task.status === 'completed' ? <CheckCircle2 className="text-green-600" size={26} /> : <Circle className="text-gray-400 group-hover:text-gray-600" size={26} />}</button>
                    <button onClick={() => handleDeleteTask(task.task_id)} className="text-gray-400 hover:text-red-700"><Trash2 size={22}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LIST SECTION (CLEAN AREA) */}
        <section>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><CalendarClock size={16}/> Daftar Tugas</h3>
          <div className="bg-white rounded-[2rem] p-3 shadow-inner border border-gray-100 flex flex-col gap-1.5">
            {unpinnedTasks.map(task => (
              <div key={task.task_id} className={`flex items-center gap-5 p-5 rounded-3xl transition ${task.status === 'completed' ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50'}`}>
                <button onClick={() => toggleStatus(task)}>{task.status === 'completed' ? <CheckCircle2 className="text-green-500" size={22} /> : <Circle className="text-gray-300 group-hover:text-gray-400" size={22} />}</button>
                <div className="flex-1">
                  <h4 className={`text-base font-bold ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-950'}`}>{task.title}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5"><Clock size={13}/> {new Date(task.due_date).toLocaleString('id-ID')}</div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${getPriorityBadge(task.priority)}`}>
                        {task.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => togglePin(task)} className="text-xs font-bold text-gray-400 hover:text-black bg-gray-100 px-4 py-2.5 rounded-xl">Pin</button>
                  <button onClick={() => handleDeleteTask(task.task_id)} className="text-gray-300 hover:text-red-600"><Trash2 size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MODAL (LENGKUNG BESAR) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-2xl border border-gray-100 relative">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-extrabold text-2xl tracking-tight text-gray-900">Buat Tugas Baru</h3>
                <button onClick={() => setShowModal(false)}><X size={26} className="text-gray-400 hover:text-black"/></button>
              </div>
              <form onSubmit={handleAddTask} className="flex flex-col gap-6">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul Tugas" className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white" required />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi (Opsional)" className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none min-h-[120px] focus:border-blue-500 focus:bg-white" />
                <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:border-blue-500 focus:bg-white" required />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl mt-4 shadow-lg shadow-blue-600/30">Simpan</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}