import React, { useState, useEffect } from 'react';
import { User, UserRole, Trade, TradeStatus } from '../types';
import api from '../services/apiService';

// Notification Modal Component
const NotificationModal: React.FC<{
    message: string;
    type: 'success' | 'error';
    onClose: () => void
}> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div
                className="bg-[#1e2329] w-full max-w-md p-8 rounded-xl border-2 animate-fadeIn"
                style={{ borderColor: type === 'success' ? '#10b981' : '#ef4444' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: type === 'success' ? '#10b98120' : '#ef444420' }}
                    >
                        {type === 'success' ? (
                            <svg className="w-6 h-6" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold uppercase text-sm mb-1" style={{ color: type === 'success' ? '#10b981' : '#ef4444' }}>
                            {type === 'success' ? 'Success' : 'Error'}
                        </h3>
                        <p className="text-xs text-[#848e9c]">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminClients: React.FC<{ clients: User[], setClients: any, trades: Trade[] }> = ({ clients, setClients, trades }) => {
    const [showAddClient, setShowAddClient] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', email: '', deposit: '10000', password: '' });
    const [editingClient, setEditingClient] = useState<string | null>(null);
    const [editData, setEditData] = useState<{ name: string; initialDeposit: string }>({ name: '', initialDeposit: '' });
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Load all clients from backend on mount
    useEffect(() => {
        loadClientsFromBackend();
    }, []);

    const loadClientsFromBackend = async () => {
        try {
            const response = await api.auth.getAllUsers();
            if (response.data) {
                const allUsers = response.data as any[];
                // Filter only clients
                const clientUsers = allUsers.filter((u: any) => u.role === 'CLIENT').map((u: any) => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    initialDeposit: u.initial_deposit,
                    role: UserRole.CLIENT
                }));
                setClients(clientUsers);
            }
        } catch (err) {
            console.error('Failed to load clients:', err);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const addClient = async () => {
        if (!newClient.name || !newClient.email || !newClient.password) {
            showNotification("Please fill all fields", 'error');
            return;
        }

        try {
            const response = await api.auth.register(
                newClient.email,
                newClient.name,
                newClient.password,
                Number(newClient.deposit),
                'CLIENT'
            );

            if (response.error) {
                showNotification("Registration Failed: " + response.error, 'error');
                return;
            }

            // Reload clients from backend
            await loadClientsFromBackend();
            setShowAddClient(false);
            setNewClient({ name: '', email: '', deposit: '10000', password: '' });
            showNotification("Client Account Created Successfully", 'success');
        } catch (err) {
            console.error(err);
            showNotification("An error occurred during registration", 'error');
        }
    };

    const startEdit = (client: User) => {
        setEditingClient(client.id);
        setEditData({ name: client.name, initialDeposit: client.initialDeposit.toString() });
    };

    const cancelEdit = () => {
        setEditingClient(null);
        setEditData({ name: '', initialDeposit: '' });
    };

    const saveEdit = async (clientId: string) => {
        try {
            const response = await api.auth.updateUser(clientId, {
                name: editData.name,
                initial_deposit: Number(editData.initialDeposit)
            });

            if (response.error) {
                showNotification("Update Failed: " + response.error, 'error');
                return;
            }

            // Update local state
            setClients(clients.map(c =>
                c.id === clientId
                    ? { ...c, name: editData.name, initialDeposit: Number(editData.initialDeposit) }
                    : c
            ));
            setEditingClient(null);
            showNotification("Client Updated Successfully", 'success');
        } catch (err) {
            console.error(err);
            showNotification("An error occurred during update", 'error');
        }
    };

    const deleteClient = async (clientId: string) => {
        try {
            const response = await api.auth.deleteUser(clientId);

            if (response.error) {
                showNotification("Delete Failed: " + response.error, 'error');
                return;
            }

            // Remove from local state
            setClients(clients.filter(c => c.id !== clientId));
            setDeleteConfirm(null);
            showNotification("Client Deleted Successfully", 'success');
        } catch (err) {
            console.error(err);
            showNotification("An error occurred during deletion", 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold uppercase tracking-wider">Client Management</h2>
                <button onClick={() => setShowAddClient(true)} className="bg-[#fcd535] text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest">Add Client</button>
            </div>

            <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#2b3139] text-[#848e9c] text-[10px] uppercase font-bold tracking-wider">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Initial</th>
                            <th className="p-4">Active Positions</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2b3139] text-xs">
                        {clients.map(c => (
                            <tr key={c.id} className="hover:bg-[#2b3139]/30">
                                {editingClient === c.id ? (
                                    <>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                className="bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-xs w-full"
                                            />
                                        </td>
                                        <td className="p-4 text-[#848e9c]">{c.email}</td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                value={editData.initialDeposit}
                                                onChange={e => setEditData({ ...editData, initialDeposit: e.target.value })}
                                                className="bg-[#0b0e11] border border-[#2b3139] p-2 rounded text-xs w-24"
                                            />
                                        </td>
                                        <td className="p-4 font-bold text-[#fcd535]">
                                            {trades.filter(t => t.clientId === c.id && t.status === TradeStatus.OPEN).length}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEdit(c.id)}
                                                    className="bg-[#10b981] text-white px-3 py-1 rounded text-[10px] uppercase font-bold"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-[#848e9c] text-white px-3 py-1 rounded text-[10px] uppercase font-bold"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-4 font-bold uppercase">{c.name}</td>
                                        <td className="p-4 text-[#848e9c]">{c.email}</td>
                                        <td className="p-4">${c.initialDeposit.toLocaleString()}</td>
                                        <td className="p-4 font-bold text-[#fcd535]">
                                            {trades.filter(t => t.clientId === c.id && t.status === TradeStatus.OPEN).length}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(c)}
                                                    className="bg-[#fcd535] text-black px-3 py-1 rounded text-[10px] uppercase font-bold"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(c.id)}
                                                    className="bg-[#ef4444] text-white px-3 py-1 rounded text-[10px] uppercase font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Client Modal */}
            {showAddClient && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1e2329] w-full max-w-md p-8 rounded-xl border border-[#2b3139]">
                        <h3 className="text-lg font-bold mb-6 uppercase">Provision New Account</h3>
                        <div className="space-y-4">
                            <input
                                placeholder="Client Full Name"
                                className="w-full bg-[#0b0e11] border border-[#2b3139] p-3 rounded text-xs"
                                value={newClient.name}
                                onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-[#0b0e11] border border-[#2b3139] p-3 rounded text-xs"
                                value={newClient.email}
                                onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-[#0b0e11] border border-[#2b3139] p-3 rounded text-xs"
                                value={newClient.password}
                                onChange={e => setNewClient({ ...newClient, password: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Initial Deposit (USD)"
                                className="w-full bg-[#0b0e11] border border-[#2b3139] p-3 rounded text-xs"
                                value={newClient.deposit}
                                onChange={e => setNewClient({ ...newClient, deposit: e.target.value })}
                            />
                            <button onClick={addClient} className="w-full bg-[#fcd535] text-black py-4 rounded font-bold text-xs uppercase tracking-widest mt-4">Create Account</button>
                            <button onClick={() => setShowAddClient(false)} className="w-full text-[10px] text-[#848e9c] uppercase tracking-widest">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1e2329] w-full max-w-md p-8 rounded-xl border-2 border-[#ef4444]">
                        <h3 className="text-lg font-bold mb-4 uppercase text-[#ef4444]">Confirm Delete</h3>
                        <p className="text-xs text-[#848e9c] mb-6">Are you sure you want to delete this client? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => deleteClient(deleteConfirm)}
                                className="flex-1 bg-[#ef4444] text-white py-3 rounded font-bold text-xs uppercase"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-[#848e9c] text-white py-3 rounded font-bold text-xs uppercase"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Modal */}
            {notification && (
                <NotificationModal
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default AdminClients;
