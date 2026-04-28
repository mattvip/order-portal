import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'   // <-- add this line if using Resend

const resend = new Resend(process.env.RESEND_API_KEY)  // <-- add this for Resend

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

// ---- PATCH HANDLER STARTS HERE ----
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
        // add more fields as needed if required
      }
    })

    // Send email on "Submitted" status
    if (body.status === 'Submitted') {
      // Set the correct vendor email
      const vendorEmail = updatedOrder.vendorEmail || 'vendor@example.com'
      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: vendorEmail,
        subject: `Order #${updatedOrder.id} submitted`,
        html: `<p>Your order titled <b>${updatedOrder.title}</b> has been submitted.</p>`
      })
    }

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 })
  }
}
