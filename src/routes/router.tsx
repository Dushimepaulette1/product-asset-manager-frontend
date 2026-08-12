import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/AppLayout.tsx'
import ProductListing from '../pages/ProductListing.tsx'
import ProductDetail from '../pages/ProductDetail.tsx'
import Login from '../pages/Login.tsx'
import UnauthorizedPage from '../pages/UnauthorizedPage.tsx'
import NotFound from '../pages/NotFound.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ProductListing /> },
      { path: 'products/:productId', element: <ProductDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'admin/products', element: <UnauthorizedPage /> },
      { path: 'admin/products/new', element: <UnauthorizedPage /> },
      { path: 'admin/products/:productId/edit', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
