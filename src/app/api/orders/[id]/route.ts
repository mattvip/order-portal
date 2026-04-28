import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Adjust this import path if needed

export async function GET(request, { params }) {
  // Parse order id from the url
  const id = Number(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
  }

  // Fetch the order from the database
  const order = await prisma.order.findUnique({ where: { id } })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json(order, { status: 200 })
}
