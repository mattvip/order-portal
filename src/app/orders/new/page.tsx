'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SIZE_LABELS: Record<string, string> = {
  qtySmall: 'Small',
  qtyMedium: 'Medium',
  qtyLarge: 'Large',
  qtyXL: 'XL',
  qty2X: '2XL',
  qty3X: '3XL',
}

export default function NewOrderPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: '',
    sku: '',
    qtySmall: '0',
    qtyMedium: '0',
    qtyLarge: '0',
    qtyXL: '0',
    qty2X: '0',
    qty3X: '0',
    expectedDate: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const body = {
      title: form.title,
      sku: form.sku,
      qtySmall: parseInt(form.qtySmall, 10),
      qtyMedium: parseInt(form.qtyMedium, 10),
      qtyLarge: parseInt(form.qtyLarge, 10),
      qtyXL: parseInt(form.qtyXL, 10),
      qty2X: parseInt(form.qty2X, 10),
      qty3X: parseInt(form.qty3X, 10),
      expectedDate: form.expectedDate,
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(data.error || 'Failed to create order')
      return
    }

    router.push('/orders')
  }

  return (
    <main className="container">
      <div className="page-header">
        <h1>New Order</h1>
        <Link href="/orders" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Order Title *</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} placeholder="e.g. Spring Collection T-Shirts" required />
          </div>
          <div className="form-group">
            <label htmlFor="sku">SKU *</label>
            <input id="sku" name="sku" type="text" value={form.sku} onChange={handleChange} placeholder="e.g. TSHRT-2024-001" required />
          </div>
          <div className="form-group">
            <label>Quantities by Size</label>
            <div className="qty-grid">
              {(['qtySmall', 'qtyMedium', 'qtyLarge', 'qtyXL', 'qty2X', 'qty3X'] as const).map(field => (
                <div key={field}>
                  <label htmlFor={field} style={{ fontWeight: 'normal', color: '#64748b' }}>
                    {SIZE_LABELS[field]}
                  </label>
                  <input id={field} name={field} type="number" min="0" value={form[field]} onChange={handleChange} />
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="expectedDate">Expected Delivery Date *</label>
            <input id="expectedDate" name="expectedDate" type="date" value={form.expectedDate} onChange={handleChange} required />
          </div>
          <div className="btn-gap">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Order (Save as Draft)'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
