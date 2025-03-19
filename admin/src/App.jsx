import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import Layout from './components/Layout'
import AdminDashboard from './pages/AdminDashboard'
import ServiceTicket from './pages/Service shedule/ServiceTicket'
import Employee from './pages/Employee/Employee'
import Customer from './pages/Customer'
import Billing from './pages/Billing'
import SpareParts from './pages/Spare Parts/SpareParts'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Setting from './pages/Setting'
import CreateEmployee from './pages/Employee/CreateEmployee'
import UpdateEmployee from './pages/Employee/UpdateEmployee'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='service_ticket' element={<ServiceTicket />} />
          <Route path='employee' element={<Employee />} />
          <Route path='customer' element={<Customer />} />
          <Route path='billing' element={<Billing />} />
          <Route path='spare_parts' element={<SpareParts />} />
          <Route path='analytics' element={<Analytics />} />
          <Route path='profile' element={<Profile />} />
          <Route path='setting' element={<Setting />} />
          <Route path='createEmployee' element={<CreateEmployee />} />
          <Route path='updateEmployee/:id' element={<UpdateEmployee />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
