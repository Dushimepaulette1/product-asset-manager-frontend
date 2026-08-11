import { useParams } from 'react-router-dom'

function EditProduct() {
  const { productId } = useParams()

  return (
    <section>
      <h1>Edit Product</h1>
      <p>productId: {productId}</p>
    </section>
  )
}

export default EditProduct
