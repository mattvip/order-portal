import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

export async function GET(request: NextRequest, { params }: any) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
  }
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  return NextResponse.json(order, { status: 200 })
}

export async function PATCH(request: NextRequest, { params }: any) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        // add more fields here if needed
      }
    })

    // Send email when order is submitted
    if (body.status === 'Submitted') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      // Compose the email body from all order fields
      const {
        id,
        title,
        vendor,
        sku,
        productType,
        designName,
        blankType,
        itemQuantity,
        expectedDate,
        notes,
        status,
        createdAt,
        updatedAt,
        qtySmall,
        qtyMedium,
        qtyLarge,
        qtyXL,
        qty2X,
        qty3X,
        qty4X,
      } = updatedOrder

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'stitch98@stitch98.com', // Hard-coded vendor email
        subject: `Order #${id} submitted`,
        html: `
          <h2>Order #${id} Submitted</h2>
          <ul>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Vendor:</strong> ${vendor ?? ''}</li>
            <li><strong>SKU:</strong> ${sku ?? ''}</li>
            <li><strong>Product Type:</strong> ${productType ?? ''}</li>
            <li><strong>Design Name:</strong> ${designName ?? ''}</li>
            <li><strong>Blank Type:</strong> ${blankType ?? ''}</li>
            <li><strong>Quantity:</strong> ${itemQuantity ?? ''}</li>
            <li><strong>Expected Date:</strong> ${expectedDate ? new Date(expectedDate).toLocaleDateString() : ''}</li>
            <li><strong>Notes:</strong> ${notes ?? ''}</li>
            <li><strong>Status:</strong> ${status}</li>
            <li><strong>Created At:</strong> ${createdAt ? new Date(createdAt).toLocaleString() : ''}</li>
            <li><strong>Last Updated:</strong> ${updatedAt ? new Date(updatedAt).toLocaleString() : ''}</li>
          </ul>
          <h3>Size Breakdown</h3>
          <ul>
            <li>Small: ${qtySmall ?? 0}</li>
            <li>Medium: ${qtyMedium ?? 0}</li>
            <li>Large: ${qtyLarge ?? 0}</li>
            <li>XL: ${qtyXL ?? 0}</li>
            <li>2XL: ${qty2X ?? 0}</li>
            <li>3XL: ${qty3X ?? 0}</li>
            <li>4XL: ${qty4X ?? 0}</li>
          </ul>
        `,
      }

      try {
        await transporter.sendMail(mailOptions)
      } catch (emailErr) {
        console.error('EMAIL SEND ERROR:', emailErr)
        return NextResponse.json({
          error: 'Order updated but email failed',
          details: String(emailErr)
        }, { status: 500 })
      }
    }

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    console.error('ORDER PATCH ERROR:', error)
    return NextResponse.json({
      error: 'Could not update order',
      details: String(error)
    }, { status: 500 })
  }
}
