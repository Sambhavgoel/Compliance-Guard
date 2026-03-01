import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import {AuthProvider} from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public route */}
          <Route path="/login" element={<Login/>}/>
          {/* ProtectedRoute */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard/>
              </Layout>
            </ProtectedRoute>
          }  />

          {/* redirect to anyknown path to dashboard */}
          <Route path='*' element={<Navigate to="/dashboard" replace />}  />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App