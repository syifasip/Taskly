import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Plus, X } from 'lucide-react';
import api from '@/utils/axios';

export default function Roles() {
  const router = useRouter();
  const { workspaceId } = router.query;
  const [workspace, setWorkspace] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [viewTasks, setViewTasks] = useState(true);
  const [createTasks, setCreateTasks] = useState(false);
  const [updateTasks, setUpdateTasks] = useState(false);
  const [deleteTasks, setDeleteTasks] = useState(false);
  const [manageRoles, setManageRoles] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceAndRoles();
    }
  }, [workspaceId]);

  const fetchWorkspaceAndRoles = async () => {
    try {
      const wsRes = await api.get(`/workspace/url/${workspaceId}`);
      if (wsRes.data.success) {
        const ws = wsRes.data.payload;
        setWorkspace(ws);
        const rRes = await api.get(`/role/${ws.workspace_id}`);
        if (rRes.data.success) setRoles(rRes.data.payload);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/role/${workspace.workspace_id}`, {
        role_name: roleName,
        view_tasks: viewTasks,
        create_tasks: createTasks,
        update_tasks: updateTasks,
        delete_tasks: deleteTasks,
        manage_roles: manageRoles
      });
      if (res.data.success) {
        fetchWorkspaceAndRoles();
        setShowModal(false);
        setRoleName(''); setCreateTasks(false); setUpdateTasks(false); setDeleteTasks(false); setManageRoles(false);
      }
    } catch (err) {
      alert('Gagal membuat role.');
    }
  };

  return (
    <Layout>
      <div className="px-8 pb-8 h-full overflow-y-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight">Roles & Permissions</h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">Role-Based Access Control (RBAC).</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#111] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-gray-800 transition">
            <Plus size={16} /> Tambah Role
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Buat Role Baru</h3>
                <button onClick={() => setShowModal(false)}><X size={24} className="text-gray-400 hover:text-black"/></button>
              </div>
              <form onSubmit={handleCreateRole} className="flex flex-col gap-4">
                <input type="text" value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="Nama Role" className="w-full bg-gray-50 border p-4 rounded-xl outline-none" required />
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={viewTasks} onChange={e => setViewTasks(e.target.checked)} className="w-5 h-5" />
                  <span className="text-sm font-semibold text-gray-700">View Tasks</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={createTasks} onChange={e => setCreateTasks(e.checked)} className="w-5 h-5" />
                  <span className="text-sm font-semibold text-gray-700">Create Tasks</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={updateTasks} onChange={e => setUpdateTasks(e.checked)} className="w-5 h-5" />
                  <span className="text-sm font-semibold text-gray-700">Update Tasks</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={deleteTasks} onChange={e => setDeleteTasks(e.checked)} className="w-5 h-5" />
                  <span className="text-sm font-semibold text-gray-700">Delete Tasks</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input type="checkbox" checked={manageRoles} onChange={e => setManageRoles(e.checked)} className="w-5 h-5" />
                  <span className="text-sm font-semibold text-gray-700">Manage Roles</span>
                </label>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-2">Simpan Role</button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map(r => (
            <div key={r.role_id} className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-xl text-gray-900 mb-3">{r.role_name}</h3>
              <div className="flex gap-2 text-xs font-bold text-gray-600 flex-wrap mt-4">
                {r.view_tasks && <span className="bg-gray-50 px-3 py-2 rounded-lg border">View Tasks</span>}
                {r.create_tasks && <span className="bg-gray-50 px-3 py-2 rounded-lg border">Create Tasks</span>}
                {r.update_tasks && <span className="bg-gray-50 px-3 py-2 rounded-lg border">Update Tasks</span>}
                {r.delete_tasks && <span className="bg-gray-50 px-3 py-2 rounded-lg border">Delete Tasks</span>}
                {r.manage_roles && <span className="bg-gray-50 px-3 py-2 rounded-lg border">Manage Roles</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}