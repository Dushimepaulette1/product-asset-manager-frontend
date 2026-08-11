import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/AppLayout.tsx'
import Dashboard from '../pages/Dashboard.tsx'
import ProductList from '../pages/ProductList.tsx'
import CreateProduct from '../pages/CreateProduct.tsx'
import ProductDetail from '../pages/ProductDetail.tsx'
import EditProduct from '../pages/EditProduct.tsx'
import AssetLibrary from '../pages/AssetLibrary.tsx'
import AssetReviewQueue from '../pages/AssetReviewQueue.tsx'
import AssetDetail from '../pages/AssetDetail.tsx'
import NotFound from '../pages/NotFound.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'products/new', element: <CreateProduct /> },
      { path: 'products/:productId', element: <ProductDetail /> },
      { path: 'products/:productId/edit', element: <EditProduct /> },
      { path: 'assets', element: <AssetLibrary /> },
      { path: 'assets/review', element: <AssetReviewQueue /> },
      { path: 'assets/:assetId', element: <AssetDetail /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
