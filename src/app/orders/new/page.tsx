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
    expectedDate: '',
    qtySmall: '0',
    qtyMedium: '0',
    qtyLarge: '0',
    qtyXL: '0',
    qty2X: '0',
    qty3X: '0',
    qty4X: '0',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const body: any = {
      title: form.title,
      sku: form.sku,
      productType: form.productType,
      designName: form.designName,
      blankType: form.blankType,
      expectedDate: form.expectedDate,
      qtySmall: parseInt(form.qtySmall) || 0,
      qtyMedium: parseInt(form.qtyMedium) || 0,
      qtyLarge: parseInt(form.qtyLarge) || 0,
      qtyXL: parseInt(form.qtyXL) || 0,
      qty2X: parseInt(form.qty2X) || 0,
      qty3X: parseInt(form.qty3X) || 0,
      qty4X: parseInt(form.qty4X) || 0,
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
            <label htmlFor="sku">SKU (Optional)</label>
            <input id="sku" name="sku" type="text" value={form.sku} onChange={handleChange} placeholder="e.g. TSHRT-2024-001" />
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
          <div className="form-group">
            <label htmlFor="designName">Design Name *</label>
            <input id="designName" name="designName" type="text" value={form.designName} onChange={handleChange} placeholder="e.g. Logo Design" required />
          </div>
          <div className="form-group">
            <label htmlFor="blankType">Blank Type (Optional)</label>
            <input id="blankType" name="blankType" type="text" value={form.blankType} onChange={handleChange} placeholder="e.g. Gildan 5000" />
          </div>
          <div className="form-group">
            <label>T-Shirt Quantities</label>
            <div className="qty-grid">
              <div>
                <label>Small</label>
                <input name="qtySmall" type="number" min="0" value={form.qtySmall} onChange={handleChange} />
              </div>
              <div>
                <label>Medium</label>
                <input name="qtyMedium" type="number" min="0" value={form.qtyMedium} onChange={handleChange} />
              </div>
              <div>
                <label>Large</label>
                <input name="qtyLarge" type="number" min="0" value={form.qtyLarge} onChange={handleChange} />
              </div>
              <div>
                <label>XL</label>
                <input name="qtyXL" type="number" min="0" value={form.qtyXL} onChange={handleChange} />
              </div>
              <div>
                <label>2X</label>
                <input name="qty2X" type="number" min="0" value={form.qty2X} onChange={handleChange} />
              </div>
              <div>
                <label>3X</label>
                <input name="qty3X" type="number" min="0" value={form.qty3X} onChange={handleChange} />
              </div>
              <div>
                <label>4X</label>
                <input name="qty4X" type="number" min="0" value={form.qty4X} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="expectedDate">Expected Delivery Date (Optional)</label>
            <input id="expectedDate" name="expectedDate" type="date" value={form.expectedDate} onChange={handleChange} />
          </div>
          <div className="btn-gap">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
