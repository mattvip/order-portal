import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // adjust if your prisma client is elsewhere

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
        // add more fields if needed for your logic
      }
    })

    // TODO: add your email sending logic here, if needed

    return NextResponse.json(updatedOrder, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 })
  }
}
