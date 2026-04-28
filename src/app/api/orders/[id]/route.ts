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
        // ...other fields you want to update upon submission
      }
    })

    // Send email when order is submitted
    if (body.status === 'Submitted') {
      // Fill in your own sender and recipient
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,    // your Gmail address
          pass: process.env.GMAIL_PASS,    // your Gmail App password
        },
      })

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: updatedOrder.vendor || 'stitch98@stitch98.com', // Update this as needed
        subject: `Order #${updatedOrder.id} submitted`,
        html: `<p>Your order titled <b>${updatedOrder.title}</b> has been submitted.</p>`,
      }

      await transporter.sendMail(mailOptions)
    }

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 })
  }
}
