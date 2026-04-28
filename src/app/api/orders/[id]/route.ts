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

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'stitch98@stitch98.com', // <-- Hardcoded vendor address
        subject: `Order #${updatedOrder.id} submitted`,
        html: `<p>Your order titled <b>${updatedOrder.title}</b> has been submitted.</p>`,
      }

      try {
        await transporter.sendMail(mailOptions)
      } catch (emailErr) {
        // Log detailed email failure to help debugging
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
