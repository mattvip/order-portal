'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: number
  title: string
  sku: string
  productType: string
  designName?: string
  blankType?: string
  itemQuantity: number
  expectedDate: string
  status: string
  createdAt: string
  updatedAt: string
  qtySmall?: number
  qtyMedium?: number
  qtyLarge?: number
  qtyXL?: number
  qty2X?: number
  qty3X?: number
  qty4X?: number
}

function StatusBadge({ status }: { status?: string }) {
  const safeStatus = status ?? 'Unknown'
  const cls = safeStatus.replace(/\s+/g, '')
  return <span className={`badge badge-${cls}`}>{safeStatus}</span>
}

export default function OrderDetailPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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

  async function handleSubmitOrder() {
    if (!order) return
    setSubmitting(true)
    setError('')
    const res = await fetch(`/api/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Submitted' }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) {
      setError(data.error || 'Failed to submit order')
    } else {
      setOrder(data)
    }
  }

  if (loading)
    return (
      <main className="container">
        <p>Loading…</p>
      </main>
    )
  if (error && !order)
    return (
      <main className="container">
        <div className="error-msg">{error}</div>
      </main>
    )
  if (!order)
    return (
      <main className="container">
        <p>Order not found.</p>
      </main>
    )

  return (
    <main className="container">
      <div className="page-header">
        <h1>Order #{order.id}</h1>
        <Link href="/orders" className="btn btn-secondary">
          ← Back to Orders
        </Link>
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
            <p>{order.sku ?? ''}</p>
          </div>
          <div className="detail-item">
            <label>Product Type</label>
            <p>{order.productType}</p>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <p>
              <StatusBadge status={order.status} />
            </p>
          </div>
          <div className="detail-item">
            <label>Expected Date</label>
            <p>{order.expectedDate ? new Date(order.expectedDate).toLocaleDateString() : ''}</p>
          </div>
          <div className="detail-item">
            <label>Created</label>
            <p>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</p>
          </div>
          <div className="detail-item">
            <label>Last Updated</label>
            <p>{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : ''}</p>
          </div>
        </div>

        <h2>Product Details</h2>
        <div className="detail-grid" style={{ marginBottom: '1.5rem' }}>
          {order.productType === 'TShirt' && (
            <>
              <div className="detail-item">
                <label>Design Name</label>
                <p>{order.designName ?? ''}</p>
              </div>
              <div className="detail-item">
                <label>Blank Type</label>
                <p>{order.blankType ?? ''}</p>
              </div>
            </>
          )}
          {(order.productType === 'Hat' || order.productType === 'Diecast') && order.blankType && (
            <div className="detail-item">
              <label>Blank Type</label>
              <p>{order.blankType ?? ''}</p>
            </div>
          )}
          <div className="detail-item">
            <label>Quantity</label>
            <p>{order.itemQuantity ?? ''}</p>
          </div>
          {order.productType === 'TShirt' && (
            <div className="detail-item">
              <label>Size Breakdown</label>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {order.qtySmall && order.qtySmall > 0 && (
                  <li>Small: {order.qtySmall}</li>
                )}
                {order.qtyMedium && order.qtyMedium > 0 && (
                  <li>Medium: {order.qtyMedium}</li>
                )}
                {order.qtyLarge && order.qtyLarge > 0 && (
                  <li>Large: {order.qtyLarge}</li>
                )}
                {order.qtyXL && order.qtyXL > 0 && (
                  <li>XL: {order.qtyXL}</li>
                )}
                {order.qty2X && order.qty2X > 0 && (
                  <li>2XL: {order.qty2X}</li>
                )}
                {order.qty3X && order.qty3X > 0 && (
                  <li>3XL: {order.qty3X}</li>
                )}
                {order.qty4X && order.qty4X > 0 && (
                  <li>4XL: {order.qty4X}</li>
                )}
              </ul>
            </div>
          )}

          {order.status === 'Draft' && (
            <div className="btn-gap">
              <button
                className="btn btn-primary"
                onClick={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Submit Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
