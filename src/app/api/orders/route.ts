import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { title, sku, qtySmall, qtyMedium, qtyLarge, qtyXL, qty2X, qty3X, expectedDate } = body

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 })
  }
  if (!expectedDate) {
    return NextResponse.json({ error: 'Expected date is required' }, { status: 400 })
  }

  const quantities = { qtySmall, qtyMedium, qtyLarge, qtyXL, qty2X, qty3X }
  for (const [key, val] of Object.entries(quantities)) {
    if (!Number.isInteger(val) || (val as number) < 0) {
      return NextResponse.json({ error: `${key} must be a non-negative integer` }, { status: 400 })
    }
  }

  const order = await prisma.order.create({
    data: {
      title: title.trim(),
      sku: sku.trim(),
      qtySmall: qtySmall ?? 0,
      qtyMedium: qtyMedium ?? 0,
      qtyLarge: qtyLarge ?? 0,
      qtyXL: qtyXL ?? 0,
      qty2X: qty2X ?? 0,
      qty3X: qty3X ?? 0,
      expectedDate: new Date(expectedDate),
      status: 'Draft',
    },
  })

  return NextResponse.json(order, { status: 201 })
}
