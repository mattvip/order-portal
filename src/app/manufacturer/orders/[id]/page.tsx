'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: number
  title: string
  sku: string
  qtySmall: number
  qtyMedium: number
  qtyLarge: number
  qtyXL: number
  qty2X: number
  qty3X: number
  expectedDate: string
  status: string
  createdAt: string
  updatedAt: string
}

function StatusBadge({ status }: { status: string }) {
  const cls = status.replace(/\s+/g, '')
  return <span className={`badge badge-${cls}`}>{status}</span>
}

const NEXT_STATUSES: Record<string, string[]> = {
  Accepted: ['In Production'],
  'In Production': ['Completed'],
}

export default function ManufacturerOrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setOrder(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load order. Please refresh and try again.')
        setLoading(false)
      })
  }, [params.id])

  async function updateStatus(status: string) {
    if (!order) return
    setWorking(true)
    setError('')
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    setWorking(false)
    if (!res.ok) {
      setError(data.error || 'Failed to update status')
    } else {
      setOrder(data)
    }
  }

  if (loading) return <main className="container"><p>Loading…</p></main>
  if (error && !order) return <main className="container"><div className="error-msg">{error}</div></main>
  if (!order) return <main className="container"><p>Order not found.</p></main>

  const quantities = [
    { label: 'Small', value: order.qtySmall },
    { label: 'Medium', value: order.qtyMedium },
    { label: 'Large', value: order.qtyLarge },
    { label: 'XL', value: order.qtyXL },
    { label: '2XL', value: order.qty2X },
    { label: '3XL', value: order.qty3X },
  ]

  const canAcceptReject = order.status === 'Submitted'
  const nextStatuses = NEXT_STATUSES[order.status] ?? []

  return (
    <main className="container">
      <div className="banner">⚠️ Manufacturer View — No authentication required for MVP</div>
      <div className="page-header">
        <h1>Order #{order.id}</h1>
        <Link href="/manufacturer/orders" className="btn btn-secondary">← Back</Link>
      </div>
      {error && <div className="error-msg">{error}</div>}
      <div className="card">
        <div className="detail-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="detail-item">
            <label>Title</label>
            <p>{order.title}</p>
          </div>
          <div className="detail-item">
            <label>SKU</label>
            <p>{order.sku}</p>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <p><StatusBadge status={order.status} /></p>
          </div>
          <div className="detail-item">
            <label>Expected Date</label>
            <p>{new Date(order.expectedDate).toLocaleDateString()}</p>
          </div>
          <div className="detail-item">
            <label>Created</label>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="detail-item">
            <label>Last Updated</label>
            <p>{new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <h2>Quantities</h2>
        <div className="qty-grid" style={{ marginBottom: '1.5rem' }}>
          {quantities.map(q => (
            <div className="detail-item" key={q.label}>
              <label>{q.label}</label>
              <p>{q.value}</p>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: '0.75rem' }}>Actions</h2>
        <div className="btn-gap">
          {canAcceptReject && (
            <>
              <button className="btn btn-success" onClick={() => updateStatus('Accepted')} disabled={working}>
                {working ? 'Updating…' : '✓ Accept'}
              </button>
              <button className="btn btn-danger" onClick={() => updateStatus('Rejected')} disabled={working}>
                {working ? 'Updating…' : '✗ Reject'}
              </button>
            </>
          )}
          {nextStatuses.map(s => (
            <button key={s} className="btn btn-primary" onClick={() => updateStatus(s)} disabled={working}>
              {working ? 'Updating…' : `→ Mark as ${s}`}
            </button>
          ))}
          {!canAcceptReject && nextStatuses.length === 0 && (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No actions available for status: <strong>{order.status}</strong></p>
          )}
        </div>
      </div>
    </main>
  )
}
