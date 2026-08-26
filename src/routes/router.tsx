import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/AppLayout.tsx'
import ProductListing from '../pages/ProductListing.tsx'
import ProductDetail from '../pages/ProductDetail.tsx'
import Login from '../pages/Login.tsx'
import NotFound from '../pages/NotFound.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import AdminProductList from '../components/admin/AdminProductList.tsx'
import AdminProductDetail from '../components/admin/AdminProductDetail.tsx'
import AdminCreateProduct from '../components/admin/AdminCreateProduct.tsx'
import AdminEditProduct from '../components/admin/AdminEditProduct.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ProductListing /> },
      { path: 'products/:productId', element: <ProductDetail /> },
      { path: 'login', element: <Login /> },
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          { path: 'products', element: <AdminProductList /> },
          { path: 'products/new', element: <AdminCreateProduct /> },
          { path: 'products/:productId', element: <AdminProductDetail /> },
          { path: 'products/:productId/edit', element: <AdminEditProduct /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
