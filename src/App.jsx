import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

function App() {

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-white">
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App
