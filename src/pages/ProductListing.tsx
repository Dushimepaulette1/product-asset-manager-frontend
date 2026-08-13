import { useAuth } from '../context/useAuth.ts'
import Button from '../components/Button.tsx'

function ProductListing() {
  const { login, logout } = useAuth()

  return (
    <section style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h1>Product Listing</h1>

      <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Auth debug panel (temporary — not committed)</h2>
        <p>Watch the navbar above while you click these.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button onClick={() => login('user@example.com', 'password123')}>Log in as USER</Button>
          <Button onClick={() => login('admin@example.com', 'admin123')}>Log in as ADMIN</Button>
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ProductListing
