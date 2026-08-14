import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <section>
      <h1>Unauthorized</h1>
      <p>You don't have access to this page.</p>
      <Link to="/">Back to Product Listing</Link>
    </section>
  )
}

export default UnauthorizedPage
