import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../utils/axios';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.payload.token);
        localStorage.setItem('user', JSON.stringify(res.data.payload.user));

        // cek pending invite dulu
        const pendingInvite = localStorage.getItem('pendingInvite');
        if (pendingInvite) {
          localStorage.removeItem('pendingInvite');
          router.push(`/join/${pendingInvite}`);
          return;
        }

        const wsRes = await api.get('/user/workspaces');
        if (wsRes.data.success && wsRes.data.payload.length > 0) {
          router.push(`/w/${wsRes.data.payload[0].custom_url}/tasks`);
        } else {
          router.push('/create-workspace');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="bg-[#111] text-white p-12 flex flex-col justify-center">
        <h1 className="text-6xl font-bold mb-6 tracking-tighter">Taskly.</h1>
        <p className="text-lg text-gray-400 max-w-md leading-relaxed">Manajemen tugas berbasis workspace. URL unik per tim, role custom, kalender otomatis.</p>
      </div>
      <div className="flex items-center justify-center p-8 bg-[#F8F7F3]">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang</h2>
          <p className="text-gray-500 mb-8">Masuk untuk melanjutkan.</p>
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 font-medium">{error}</div>}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:bg-white transition" required />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 transition mt-2 shadow-lg">Masuk</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-8">Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar</Link></p>
        </div>
      </div>
    </div>
  );
}