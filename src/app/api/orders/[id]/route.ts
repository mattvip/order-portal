import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['Draft', 'Submitted', 'Accepted', 'In Production', 'Completed', 'Rejected']

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  return NextResponse.json(order)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseInt(rawId, 10)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const body = await request.json()
  const { status } = body

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Buyer: Draft -> Submitted
  if (status === 'Submitted') {
    if (order.status !== 'Draft') {
      return NextResponse.json({ error: 'Only Draft orders can be submitted' }, { status: 422 })
    }
  }
  // Manufacturer: Submitted -> Accepted or Rejected
  else if (status === 'Accepted' || status === 'Rejected') {
    if (order.status !== 'Submitted') {
      return NextResponse.json({ error: 'Can only accept or reject Submitted orders' }, { status: 422 })
    }
  }
  // Manufacturer: Accepted -> In Production
  else if (status === 'In Production') {
    if (order.status !== 'Accepted') {
      return NextResponse.json({ error: 'Order must be Accepted before moving to In Production' }, { status: 422 })
    }
  }
  // Manufacturer: In Production -> Completed
  else if (status === 'Completed') {
    if (order.status !== 'In Production') {
      return NextResponse.json({ error: 'Order must be In Production before marking Completed' }, { status: 422 })
    }
  }
  else {
    return NextResponse.json({ error: 'Invalid status transition' }, { status: 422 })
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json(updated)
}
