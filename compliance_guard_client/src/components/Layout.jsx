import React from 'react';
import { useAuth } from '../context/AuthContext'; // THIS IMPORT IS REQUIRED
import { LayoutDashboard, FileText, ShieldCheck, LogOut } from 'lucide-react';

const Layout = ({ children }) => {
    // These will now correctly grab data from the Provider
    const { logout, user, tenantId } = useAuth();

    return (
        <div className='flex h-screen bg-slate-50'>
            <aside className='w-64 bg-slate-900 text-white flex flex-col shadow-xl'>
                <div className='p-6 text-xl font-bold border-b border-slate-800 flex items-center gap-3'>
                    <ShieldCheck className='text-blue-400' size={28}/> 
                    <span className="tracking-tight">Compliance Guard</span>
                </div>
                
                <nav className='flex-1 p-4 space-y-2 mt-4'>
                    <div className='flex items-center gap-3 p-3 bg-blue-600 rounded-xl cursor-pointer shadow-lg shadow-blue-900/20'>
                        <LayoutDashboard size={20}/> 
                        <span className="font-medium">Dashboard</span>
                    </div>
                    <div className='flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl cursor-pointer transition-all'>
                        <FileText size={20} />
                        <span className="font-medium">Transactions</span>
                    </div>
                </nav>

                <div className='p-4 border-t border-slate-800'>
                    <button onClick={logout} className='flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 w-full rounded-xl transition-all font-semibold'>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            <main className='flex-1 flex flex-col overflow-hidden'>
                <header className='h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8'>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                        Tenant: <span className="text-blue-600 font-bold">{tenantId || 'ACME_001'}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{user?.name || 'John Doe'}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">System Administrator</p>
                        </div>
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md'>
                            {user?.name?.charAt(0) || 'J'}
                        </div>
                    </div>
                </header>
                <div className='p-8 flex-1 overflow-y-auto bg-slate-50/50'>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;