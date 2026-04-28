'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SIZE_FIELDS = [
  { name: 'qtySmall', label: 'Small' },
  { name: 'qtyMedium', label: 'Medium' },
  { name: 'qtyLarge', label: 'Large' },
  { name: 'qtyXL', label: 'XL' },
  { name: 'qty2X', label: '2X' },
  { name: 'qty3X', label: '3X' },
  { name: 'qty4X', label: '4X' },
]

const SIZE_PRODUCT_TYPES = ['TShirt', 'Sweatshirt', 'Jacket']

export default function NewOrderPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Browser-only alert to prove your code is running (remove when debugging is done!)
  useEffect(() => {
    alert("NEW ORDER PAGE JS IS RUNNING! " + Math.random())
  }, [])

  const [form, setForm] = useState({
    title: '',
    vendor: '',
    sku: '',
    productType: 'TShirt',
    designName: '',
    blankType: '',
    expectedDate: '',
    itemQuantity: '0',
    qtySmall: '0',
    qtyMedium: '0',
    qtyLarge: '0',
    qtyXL: '0',
    qty2X: '0',
    qty3X: '0',
    qty4X: '0',
    notes: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // Debug log to confirm the handler is firing
    console.log("HANDLE SUBMIT FIRED")

    const body: any = {
      title: form.title,
      vendor: form.vendor,
      sku: form.sku,
      productType: form.productType,
      designName: form.designName,
      blankType: form.blankType,
      expectedDate: form.expectedDate,
      notes: form.notes,
    }

    if (SIZE_PRODUCT_TYPES.includes(form.productType)) {
      SIZE_FIELDS.forEach(f => {
        body[f.name] = parseInt(form[f.name as keyof typeof form] as string, 10) || 0
      })
    } else {
      body.itemQuantity = parseInt(form.itemQuantity, 10) || 0
    }

    // Debug log to see the exact payload sent to backend
    console.log('ORDER SUBMISSION PAYLOAD:', body)

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

  const isSizeProduct = SIZE_PRODUCT_TYPES.includes(form.productType)

  return (
    <main className="container">
      <div className="page-header">
        {/* VISUAL TEST! Change the text below to guarantee the correct file is live */}
        <h1>New Order PAGE TEST {Math.random()}</h1>
        <Link href="/orders" className="btn btn-secondary">← Back</Link>
      </div>
      <div className="card">
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Order Title *</label>
            <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="vendor">Vendor (Optional)</label>
            <input
              id="vendor"
              name="vendor"
              type="text"
              value={form.vendor}
              onChange={handleChange}
              placeholder="Who is the manufacturer?"
            />
          </div>
          <div className="form-group">
            <label htmlFor="sku">SKU (Optional)</label>
            <input id="sku" name="sku" type="text" value={form.sku} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="productType">Product Type *</label>
            <select
              id="productType"
              name="productType"
              value={form.productType}
              onChange={handleChange}
              required
            >
              <option value="TShirt">T-Shirt</option>
              <option value="Sweatshirt">Sweatshirt</option>
              <option value="Jacket">Jacket</option>
              <option value="Hat">Hat</option>
              <option value="Diecast">Diecast</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="designName">Design Name *</label>
            <input id="designName" name="designName" type="text" value={form.designName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="blankType">Blank Type (Optional)</label>
            <input id="blankType" name="blankType" type="text" value={form.blankType} onChange={handleChange} />
          </div>
          {isSizeProduct ? (
            <div className="form-group">
              <label>Quantities by Size</label>
              <div className="qty-grid">
                {SIZE_FIELDS.map(f => (
                  <div key={f.name}>
                    <label>{f.label}</label>
                    <input
                      name={f.name}
                      type="number"
                      min="0"
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="itemQuantity">Quantity *</label>
              <input
                id="itemQuantity"
                name="itemQuantity"
                type="number"
                min="1"
                value={form.itemQuantity}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="expectedDate">Expected Delivery Date (Optional)</label>
            <input
              id="expectedDate"
              name="expectedDate"
              type="date"
              value={form.expectedDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="General notes about this order"
              rows={3}
            />
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
