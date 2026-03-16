import React, { useState, useEffect } from 'react';
import { Plus, Filter, X, Activity, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    // 1. Multi-tenant State
    const [activeTenant, setActiveTenant] = useState('tenant_acme_123');
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 2. Form State
    const [formData, setFormData] = useState({
        vendor: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    });

    // 3. Fetch Function (Logic for Compliance Isolation)
    const fetchTransactions = async () => {
        try {
            // We pass tenantId as a query param to ensure we only get that tenant's data
            const response = await axios.get(`http://localhost:5000/api/transactions?tenantId=${activeTenant}`);
            setTransactions(response.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    // 4. Trigger Fetch on Tenant Change
    useEffect(() => {
        fetchTransactions();
    }, [activeTenant]);

    // 5. Submit Handler (Logic for Multi-tenant Stamping)
    const handleAddTransactions = async (e) => {
        e.preventDefault();
        
        const newEntry = {
            vendor: formData.vendor,
            amount: Number(formData.amount),
            date: formData.date,
            status: formData.status,
            tenantId: activeTenant // Stamping the record with the current tenant
        };

        try {
            const response = await axios.post('http://localhost:5000/api/transactions', newEntry);
            
            // Success: Update UI
            setTransactions(prev => [response.data, ...prev]);
            setIsModalOpen(false);
            
            // Reset Form
            setFormData({ 
                vendor: '', 
                amount: '', 
                date: new Date().toISOString().split('T')[0], 
                status: 'Pending' 
            });
        } catch (err) {
            console.error("Save Error:", err);
            alert("Failed to save: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className='space-y-8 animate-in fade-in duration-500'>
            
            {/* --- HEADER SECTION --- */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h2 className='text-3xl font-bold text-slate-900 tracking-tight'>Audit Dashboard</h2>
                    <p className='text-slate-500 font-medium'>Current Tenant: <strong>{activeTenant}</strong></p>
                </div>
                
                <div className="flex gap-4">
                    {/* Tenant Switcher Dropdown */}
                    <select 
                        value={activeTenant} 
                        onChange={(e) => setActiveTenant(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="tenant_acme_123">ACME Corp (Tenant A)</option>
                        <option value="tenant_globex_456">Globex Inc (Tenant B)</option>
                        <option value="tenant_stark_789">Stark Ent (Tenant C)</option>
                    </select>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95'
                    >
                        <Plus size={20} /> New Transaction
                    </button>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4'>
                    <div className='p-3 bg-blue-50 text-blue-600 rounded-xl'><DollarSign size={24} /></div>
                    <div>
                        <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Total Spend</p>
                        <p className='text-2xl font-bold text-slate-900'>
                            ${transactions.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4'>
                    <div className='p-3 bg-orange-50 text-orange-600 rounded-xl'><Clock size={24} /></div>
                    <div>
                        <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Pending</p>
                        <p className='text-2xl font-bold text-slate-900'>{transactions.filter(t => t.status === 'Pending').length}</p>
                    </div>
                </div>
                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4'>
                    <div className='p-3 bg-green-50 text-green-600 rounded-xl'><Activity size={24} /></div>
                    <div>
                        <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Compliance</p>
                        <p className='text-2xl font-bold text-green-600'>Active</p>
                    </div>
                </div>
            </div>

            {/* --- DATA TABLE --- */}
            <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-widest border-b'>
                            <tr>
                                <th className='p-5'>Vendor</th>
                                <th className='p-5'>Date</th>
                                <th className='p-5'>Amount</th>
                                <th className='p-5 text-center'>Status</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100'>
                            {transactions.length > 0 ? (
                                transactions.map((item) => (
                                    <tr key={item._id} className='hover:bg-blue-50/30 transition-colors'>
                                        <td className='p-5 font-semibold text-slate-900'>{item.vendor}</td>
                                        <td className='p-5 text-slate-500 text-sm'>{item.date}</td>
                                        <td className='p-5 font-mono font-bold text-slate-900'>
                                            ${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className='p-5 text-center'>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                                item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-slate-400 italic">No transactions found for this tenant.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200'>
                        <div className='p-6 border-b flex justify-between items-center'>
                            <h3 className='text-xl font-bold text-slate-800'>Add Audit Entry</h3>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-slate-100 rounded-full'>
                                <X className='text-slate-400' size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddTransactions} className='p-6 space-y-4'>
                            <div>
                                <label className='block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest'>Vendor</label>
                                <input 
                                    type="text" required placeholder="e.g. Amazon Web Services"
                                    className='w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50' 
                                    value={formData.vendor}
                                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} 
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest'>Amount ($)</label>
                                    <input 
                                        type="number" step="0.01" required placeholder="0.00"
                                        className='w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50' 
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest'>Date</label>
                                    <input 
                                        type="date" required
                                        className='w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50' 
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Status</label>
                                <select 
                                    className="w-full border border-slate-200 p-3 rounded-xl outline-none bg-slate-50"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Pending">Pending Review</option>
                                    <option value="Approved">Approved</option>
                                </select>
                            </div>
                            <button type='submit' className='w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-[0.98] transition-all'>
                                Save Transaction
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;