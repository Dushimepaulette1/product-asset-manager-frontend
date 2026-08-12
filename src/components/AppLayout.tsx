import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.tsx'

function AppLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout
