import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/AppLayout.tsx'
import ProductListing from '../pages/ProductListing.tsx'
import ProductDetail from '../pages/ProductDetail.tsx'
import Login from '../pages/Login.tsx'
import NotFound from '../pages/NotFound.tsx'
import ProtectedRoute from './ProtectedRoute.tsx'
import AdminProductList from '../pages/admin/AdminProductList.tsx'
import AdminProductDetail from '../pages/admin/AdminProductDetail.tsx'
import AdminCreateProduct from '../pages/admin/AdminCreateProduct.tsx'
import AdminEditProduct from '../pages/admin/AdminEditProduct.tsx'

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
