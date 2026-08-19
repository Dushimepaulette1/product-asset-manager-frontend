import { useParams } from 'react-router-dom'

function AdminEditProduct() {
  const { productId } = useParams()

  return (
    <section>
      <h1>Admin Edit Product</h1>
      <p>productId: {productId}</p>
    </section>
  )
}

export default AdminEditProduct
