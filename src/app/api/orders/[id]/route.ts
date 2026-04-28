import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
