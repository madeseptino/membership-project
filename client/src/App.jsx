import { Routes, Route } from 'react-router'
import Layout from './components/Layout.jsx'
import AdminPage from './pages/AdminPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import StatusPage from './pages/StatusPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/status/:orderId" element={<StatusPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App