import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/AppLayout.tsx'
import Home from '../pages/Home.tsx'
import NotFound from '../pages/NotFound.tsx'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
