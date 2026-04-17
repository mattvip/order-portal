'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewOrderPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: '',
    sku: '',
    productType: 'TShirt',
    designName: '',
    blankType: '',
    itemQuantity: '0',
    expectedDate: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const body = {
      title: form.title,
      sku: form.sku,
      productType: form.productType,
      designName: form.designName,
      blankType: form.blankType,
      itemQuantity: parseInt(form.itemQuantity, 10),
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
            <label htmlFor="productType">Product Type *</label>
            <select id="productType" name="productType" value={form.productType} onChange={handleChange} required>
              <option value="TShirt">T-Shirt</option>
              <option value="Hat">Hat</option>
              <option value="Diecast">Diecast</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {form.productType === 'TShirt' && (
            <>
              <div className="form-group">
                <label htmlFor="designName">Design Name *</label>
                <input id="designName" name="designName" type="text" value={form.designName} onChange={handleChange} placeholder="e.g. Logo Design" required />
              </div>

              <div className="form-group">
                <label htmlFor="blankType">Blank Type *</label>
                <input id="blankType" name="blankType" type="text" value={form.blankType} onChange={handleChange} placeholder="e.g. Gildan 5000" required />
              </div>
            </>
          )}

          {(form.productType === 'Hat' || form.productType === 'Diecast') && (
            <div className="form-group">
              <label htmlFor="blankType">Blank Type</label>
              <input id="blankType" name="blankType" type="text" value={form.blankType} onChange={handleChange} placeholder="e.g. 6-panel cap" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="itemQuantity">Quantity *</label>
            <input id="itemQuantity" name="itemQuantity" type="number" min="1" value={form.itemQuantity} onChange={handleChange} required />
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
