import React,{createContext, useState, useContext, useEffect} from 'react'

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);            // for user info : role,name
    const [tenantId,setTenantId] = useState(null);    // for isolation
    const [loading,setLoading] = useState(true);      // prevent flickering on refresh

    //for persistent : keep logged after refresh
    useEffect(()=>{
        try{
            const savedToken = localStorage.getItem('token')
            const savedTenant = localStorage.getItem('tenant_id')

            if(savedToken && savedTenant)
            {
                setUser({token:savedToken})
                setTenantId(savedTenant)
            }
        }
        catch(error)
        {
            console.error("LocalStorage error : ",error)
        }
        finally{
            setLoading(false)
        }

    },[]);

    //for login
    const login = (userData,tenantData)=>{
        setUser(userData);
        setTenantId(tenantData.id)
        localStorage.setItem('token',userData.token)
        localStorage.setItem('tenant_id',tenantData.id)
    }

    //logout
    const logout= ()=>{
        setUser(null)
        setTenantId(null);
        localStorage.clear()
    }

    return (
        <AuthContext.Provider value={{user,tenantId,login,logout,loading}}>
            {/* This blocks the whole app until the storage check is DONE */}
            {!loading && children}
        </AuthContext.Provider>
    )


}

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};