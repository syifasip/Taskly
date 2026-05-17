import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/utils/axios';

export default function Stats() {
  const router = useRouter();
  const { workspaceId } = router.query;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (workspaceId) {
      api.get(`/workspace/url/${workspaceId}`).then(wsRes => {
        if (wsRes.data.success) {
          api.get(`/task/${wsRes.data.payload.workspace_id}/stats`).then(sRes => {
            if (sRes.data.success) setStats(sRes.data.payload);
          });
        }
      });
    }
  }, [workspaceId]);

  return (
    <Layout>
      <div className="px-8 pb-8 h-full overflow-y-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">Statistik & Laporan</h2>
        </div>
        {stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                <div className="text-6xl font-black text-green-500 mb-3 tracking-tighter">
                  {stats.monthly?.total || 0}
                </div>
                <div className="text-sm text-gray-600 font-bold uppercase tracking-widest">Selesai Bulan Ini</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                <div className="text-6xl font-black text-blue-500 mb-3 tracking-tighter">
                  {stats.onTime?.on_time_rate || 0}%
                </div>
                <div className="text-sm text-gray-600 font-bold uppercase tracking-widest">Tingkat Tepat Waktu</div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Distribusi Status Tugas</h4>
              <div className="space-y-4">
                {stats.byStatus?.map(s => (
                  <div key={s.status} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="capitalize font-medium text-gray-700">{s.status.replace('_', ' ')}</span>
                    <span className="font-bold text-gray-900">{s.count} Tugas</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}