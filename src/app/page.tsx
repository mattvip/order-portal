import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="container">
      <h1>Welcome to Order Portal</h1>
      <p style={{ color: '#64748b' }}>Manage your production orders end-to-end.</p>
      <div className="card-grid">
        <Link href="/orders/new" className="card-action">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛒</div>
          <h2>Place an Order</h2>
          <p>Create and submit a new production order as a buyer.</p>
        </Link>
        <Link href="/manufacturer/orders" className="card-action">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏭</div>
          <h2>Manufacturer Portal</h2>
          <p>Review, accept, and manage incoming orders.</p>
        </Link>
      </div>
    </main>
  )
}
