import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axios';

export default function Calendar() {
  const router = useRouter();
  const { workspaceId } = router.query;
  const [tasks, setTasks] = useState([]);
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const calendarGrid = Array.from({ length: 35 }, (_, i) => i - 3);

  useEffect(() => {
    if (workspaceId) {
      api.get(`/workspace/url/${workspaceId}`).then(wsRes => {
        if (wsRes.data.success) {
          api.get(`/task/${wsRes.data.payload.workspace_id}`).then(tRes => {
            if (tRes.data.success) setTasks(tRes.data.payload);
          });
        }
      });
    }
  }, [workspaceId]);

  return (
    <Layout>
      <div className="px-8 pb-8 h-full overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">Kalender Tugas</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
            {days.map(day => (<div key={day} className="p-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">{day}</div>))}
          </div>
          <div className="grid grid-cols-7">
            {calendarGrid.map((date, idx) => {
              const currentMonthDate = date > 0 && date <= 31;
              const dayTasks = tasks.filter(t => {
                const d = new Date(t.due_date);
                return d.getDate() === date;
              });
              return (
                <div key={idx} className="min-h-[120px] border-b border-r border-gray-50 p-3 hover:bg-gray-50 transition cursor-pointer">
                  {currentMonthDate && (
                    <>
                      <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mb-2 text-gray-600">{date}</div>
                      {dayTasks.map(t => (
                        <div key={t.task_id} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1.5 rounded-lg mb-1 truncate">
                          {t.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}