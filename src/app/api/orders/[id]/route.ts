import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Adjust this import path if your prisma client is elsewhere

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
