import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Send, Zap } from 'lucide-react';
import api from '@/utils/axios';

export default function Discuss() {
  const router = useRouter();
  const { workspaceId } = router.query;
  const [workspace, setWorkspace] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceDetails();
    }
  }, [workspaceId]);

  const fetchWorkspaceDetails = async () => {
    try {
      const wsRes = await api.get(`/workspace/url/${workspaceId}`);
      if (wsRes.data.success) {
        const ws = wsRes.data.payload;
        setWorkspace(ws);
        fetchHistory(ws.workspace_id);
        fetchActivity(ws.workspace_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async (id) => {
    try {
      const res = await api.get(`/message/${id}`);
      if (res.data.success) setMessages(res.data.payload);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivity = async (id) => {
    try {
      const res = await api.get(`/message/${id}/activity`);
      if (res.data.success) setActivities(res.data.payload);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const res = await api.post(`/message/${workspace.workspace_id}`, { content });
      if (res.data.success) {
        setContent('');
        fetchHistory(workspace.workspace_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="h-full flex overflow-hidden border-t border-gray-100 -mx-10">
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-gray-50/30">
            {messages.map(m => (
              <div key={m.message_id} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                  {m.sender_name ? m.sender_name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">{m.sender_name} • {new Date(m.sent_at).toLocaleTimeString()}</div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none text-sm text-gray-700 shadow-sm max-w-md">
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
            <div className="flex gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 items-center focus-within:border-blue-500 transition-all">
              <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-transparent outline-none text-sm font-medium" />
              <button type="submit" className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 shadow-md transition-all">
                <Send size={18}/>
              </button>
            </div>
          </form>
        </div>
        <div className="w-80 bg-white border-l border-gray-100 p-8 space-y-8 overflow-y-auto">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={12} className="text-yellow-500"/> Status Sistem & Aktivitas
            </h4>
            <div className="bg-green-50 text-green-700 text-[10px] font-bold px-4 py-3 rounded-xl border border-green-100 flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Redis Pub/Sub Terhubung
            </div>
            <div className="space-y-3">
              {activities.map(a => (
                <div key={a.activity_log_id} className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <span className="font-bold">{a.user_name}</span> {a.action} <span className="italic">"{a.target_title}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}