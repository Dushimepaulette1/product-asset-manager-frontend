import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Back to Product Listing</Link>
    </section>
  )
}

export default NotFound
