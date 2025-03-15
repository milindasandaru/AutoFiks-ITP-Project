import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout';
import EmployeeDashboard from './pages/EmployeeDashboard'
import WorkSchedule from './pages/WorkSchedule'
import Leaving from './pages/Leaving'
import Earning from './pages/Earning'
import Profile from './pages/Profile'
import HelpCenter from './pages/HelpCenter'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<EmployeeDashboard />} />
          <Route path='workSchedule' element={<WorkSchedule />} />
          <Route path='leaving' element={<Leaving />} />
          <Route path='earning' element={<Earning />} />
          <Route path='profile' element={<Profile />} />
          <Route path='helpcenter' element={<HelpCenter />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
