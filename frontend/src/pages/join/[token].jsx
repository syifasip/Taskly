import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../utils/axios';

export default function JoinWorkspace() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

    useEffect(() => {
    if (!token) return;
    
    // cek apakah sudah login
    const authToken = localStorage.getItem('token');
    if (!authToken) {
        // simpan invite token dulu, redirect ke login
        localStorage.setItem('pendingInvite', token);
        router.push('/login');
        return;
    }
    
    joinWorkspace();
    }, [token]);

  const joinWorkspace = async () => {
    try {
      const res = await api.get(`/workspace/join/${token}`);
      if (res.data.success) {
        setStatus('success');
        setTimeout(() => {
          router.push(`/w/${res.data.payload.custom_url}/tasks`);
        }, 1500);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Link tidak valid atau sudah kadaluarsa.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F3]">
      <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center max-w-md w-full">
        {status === 'loading' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2">Bergabung...</h2>
            <p className="text-gray-500">Memverifikasi invite link kamu.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Berhasil!</h2>
            <p className="text-gray-500">Kamu berhasil bergabung. Mengalihkan ke workspace...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold mb-2">Gagal</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <button onClick={() => router.push('/login')} className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition">
              Kembali ke Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}