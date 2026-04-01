'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Order {
  id: number
  title: string
  sku: string
  status: string
  expectedDate: string
  createdAt: string
}

function StatusBadge({ status }: { status: string }) {
  const cls = status.replace(/\s+/g, '')
  return <span className={`badge badge-${cls}`}>{status}</span>
}

export default function ManufacturerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/orders')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch orders')
        return r.json()
      })
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load orders. Please refresh and try again.')
        setLoading(false)
      })
  }, [])

  const submitted = orders.filter(o => o.status === 'Submitted')

  return (
    <main className="container">
      <div className="banner">⚠️ Manufacturer View — No authentication required for MVP</div>
      <div className="page-header">
        <h1>Manufacturer Queue</h1>
      </div>

      <h2 style={{ marginBottom: '0.75rem' }}>Pending Review ({submitted.length})</h2>
      <div className="card" style={{ marginBottom: '2rem' }}>
        {loading ? (
          <p className="empty">Loading…</p>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : submitted.length === 0 ? (
          <p className="empty">No orders pending review.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>SKU</th>
                <th>Status</th>
                <th>Expected Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {submitted.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.title}</td>
                  <td>{order.sku}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{new Date(order.expectedDate).toLocaleDateString()}</td>
                  <td><Link href={`/manufacturer/orders/${order.id}`} className="btn btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 style={{ marginBottom: '0.75rem' }}>All Orders ({orders.length})</h2>
      <div className="card">
        {loading ? (
          <p className="empty">Loading…</p>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : orders.length === 0 ? (
          <p className="empty">No orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>SKU</th>
                <th>Status</th>
                <th>Expected Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.title}</td>
                  <td>{order.sku}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{new Date(order.expectedDate).toLocaleDateString()}</td>
                  <td><Link href={`/manufacturer/orders/${order.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
