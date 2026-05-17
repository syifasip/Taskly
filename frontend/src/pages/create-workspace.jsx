import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/axios';

export default function CreateWorkspace() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [color, setColor] = useState('blue');
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/workspace', {
        name,
        custom_url: customUrl,
        color,
        access_type: 'invite'
      });
      if (res.data.success) {
        router.push(`/w/${customUrl}/tasks`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat workspace.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="bg-[#111] text-white p-12 flex flex-col justify-center">
        <h1 className="text-6xl font-bold mb-6 tracking-tighter">Workspace.</h1>
        <p className="text-lg text-gray-400 max-w-md leading-relaxed">Buat workspace pertamamu untuk mulai mengatur tugas bersama tim.</p>
      </div>
      <div className="flex items-center justify-center p-8 bg-[#F8F7F3]">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold mb-2">Buat Workspace</h2>
          <p className="text-gray-500 mb-8">Isi detail workspace kamu.</p>
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 font-medium">{error}</div>}
          <form onSubmit={handleCreate} className="flex flex-col gap-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Workspace (contoh: SBD Team 2026)"
              className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition"
              required
            />
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="URL Unik (contoh: sbd-team-2026)"
              className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition"
              required
            />
            <div className="flex gap-3">
              {['blue','yellow','green','pink','red','purple'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c === 'blue' ? '#3B82F6' : c === 'yellow' ? '#F59E0B' : c === 'green' ? '#10B981' : c === 'pink' ? '#EC4899' : c === 'red' ? '#EF4444' : '#8B5CF6' }}
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 transition mt-2 shadow-lg"
            >
              Buat Workspace
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}