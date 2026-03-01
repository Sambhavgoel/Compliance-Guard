import React, { useState } from 'react';
import {Navigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

const Login = () => {
    const { login,user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Critical Fix: Variable names must match
        const mockUser = {
            name: 'John Doe',
            role: 'Admin',
            token: 'secure_jwt_token_123'
        };

        const mockTenant = {
            id: 'tenant_acme_123',
            name: 'Acme Financial'
        };

        // We changed 'usermock' to 'mockUser' so the function actually runs
        login(mockUser, mockTenant);

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl border border-slate-100">
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-blue-600 p-4 rounded-2xl mb-4 text-white shadow-lg shadow-blue-200">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Compliance Guard</h2>
                    <p className="text-slate-400 mt-2 font-medium">Enterprise Audit Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Business Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-300" size={20} />
                            <input 
                                type="email" 
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" 
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-300" size={20} />
                            <input 
                                type="password" 
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transform active:scale-[0.98] transition-all shadow-xl shadow-blue-100 mt-4"
                    >
                        Sign In to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;