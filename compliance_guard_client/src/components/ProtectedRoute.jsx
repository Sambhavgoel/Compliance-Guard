import {Navigate} from 'react-router-dom'
import {useAuth} from'../context/AuthContext'

const ProtectedRoute = ({children})=>{
    const {user,loading} = useAuth()

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-slate-600">Checking Session...</p>
                </div>
            </div>
        );
    }

    if(!user)
    {
        // redirect
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRoute;