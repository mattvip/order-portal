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

export default function OrdersPage() {
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

  return (
    <main className="container">
      <div className="page-header">
        <h1>My Orders</h1>
        <Link href="/orders/new" className="btn btn-primary">+ New Order</Link>
      </div>
      <div className="card">
        {loading ? (
          <p className="empty">Loading…</p>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : orders.length === 0 ? (
          <p className="empty">No orders yet. <Link href="/orders/new">Create your first order →</Link></p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>SKU</th>
                <th>Status</th>
                <th>Expected Date</th>
                <th>Created</th>
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
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td><Link href={`/orders/${order.id}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
