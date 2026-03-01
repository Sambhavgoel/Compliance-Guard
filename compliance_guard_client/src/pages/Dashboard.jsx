import React, { useState } from 'react';
import { Plus, Filter, X, Activity, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
    // Transaction State
    const [transactions, setTransactions] = useState([
        { id: 1, vendor: 'Amazon Web Services', amount: 1200.50, status: 'Approved', date: '2026-02-24' },
        { id: 2, vendor: 'Stripe Payments', amount: 45.00, status: 'Pending', date: '2026-02-23' }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        vendor: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    });

    // Renamed to match the form onSubmit
    const handleAddTransactions = async(e) => {
        e.preventDefault();

        const newEntry = {
            vendor:formData.vendor,
            amount:Number(formData.amount),
            date:formData.date,
            status:formData.status,
            tenantId: 'tenant_acme_123'
        };

        try{

                const response = await axios.post('http://localhost:5000/api/transactions',newEntry)

            setTransactions(prev => [response.data, ...prev]);
            setIsModalOpen(false);
            // Fixed: date typo and toISOString() function call
            setFormData({ 
                vendor: '', 
                amount: '', 
                date: new Date().toISOString().split('T')[0], 
                status: 'Pending' 
            });
        }catch(err)
        {
            console.error("Full Error Object:", err);
        
            // Extract the message safely
            const serverMessage = err.response?.data?.error || err.response?.data?.message;
            const finalMessage = serverMessage || err.message || "Unknown Server Error";
            
            alert("Failed to save: " + finalMessage);
        }
    };

    return (
        <div className='space-y-8 animate-in fade-in duration-500'>
            {/* Header Section */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h2 className='text-3xl font-bold text-slate-900 tracking-tight'>Audit Dashboard</h2>
                    <p className='text-slate-500 font-medium'>Real-time Compliance monitoring for your organisation.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95'
                >
                    <Plus size={20} /> New Transaction
                </button>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]'>
                    <div className='p-3 bg-blue-50 text-blue-600 rounded-xl'><DollarSign size={24} /></div>
                    <div>
                        <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Total Spend</p>
                        <p className='text-2xl font-bold text-slate-900'>
                            ${transactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]'>
                    <div className='p-3 bg-orange-50 text-orange-600 rounded-xl'><Clock size={24} /></div>
                    <div>
                        <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Pending Review</p>
                        <p className='text-2xl font-bold text-slate-900'>
                            {transactions.filter(t => t.status === 'Pending').length}
                        </p>
                    </div>
                </div>

                <div className='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]'>
                    <div className='p-3 bg-green-50 text-green-600 rounded-xl'><Activity size={24} /></div>
                    <div>
                        <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>Compliance Rate</p>
                        <p className='text-2xl font-bold text-green-600'>99.4%</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className='bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden'>
                <div className='p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center'>
                    <span className='text-sm font-bold text-slate-600 uppercase tracking-tighter'>Verified Logs</span>
                    <Filter size={18} className='text-slate-400 cursor-pointer hover:text-slate-600' />
                </div>
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
                            {transactions.map((item) => (
                                <tr key={item.id} className='hover:bg-blue-50/30 transition-colors group'>
                                    <td className='p-5 font-semibold text-slate-900'>{item.vendor}</td>
                                    <td className='p-5 text-slate-500 text-sm'>{item.date}</td>
                                    <td className='p-5 font-mono font-bold text-slate-900'>
                                        ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className='p-5 text-center'>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight ${
                                            item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className='fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200'>
                        <div className='p-6 border-b flex justify-between items-center'>
                            <h3 className='text-xl font-bold text-slate-800'>Add Audit Entry</h3>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-slate-100 rounded-full transition-colors'>
                                <X className='text-slate-400' size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddTransactions} className='p-6 space-y-4'>
                            <div>
                                <label className='block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest'>Vendor</label>
                                <input 
                                    type="text" required placeholder="e.g. AWS"
                                    className='w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50 focus:bg-white' 
                                    value={formData.vendor}
                                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} 
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest'>Amount ($)</label>
                                    <input 
                                        type="number" step="0.01" required placeholder="0.00"
                                        className='w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50 focus:bg-white' 
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest'>Date</label>
                                    <input 
                                        type="date" required
                                        className='w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50 focus:bg-white' 
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">
                                        Audit Status
                                    </label>
                                    <select 
                                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Pending">Pending Review</option>
                                        <option value="Approved">Approved</option>
                                    </select>
                                </div>
                            </div>
                            <button type='submit' className='w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 mt-2 hover:bg-blue-700 active:scale-[0.98] transition-all'>
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