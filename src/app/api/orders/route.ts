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

  const { title, sku, productType, designName, blankType, itemQuantity, expectedDate } = body

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    return NextResponse.json({ error: 'SKU is required' }, { status: 400 })
  }
  if (!productType || typeof productType !== 'string') {
    return NextResponse.json({ error: 'Product type is required' }, { status: 400 })
  }
  if (!expectedDate) {
    return NextResponse.json({ error: 'Expected date is required' }, { status: 400 })
  }
  if (!Number.isInteger(itemQuantity) || (itemQuantity as number) < 1) {
    return NextResponse.json({ error: 'Quantity must be a positive integer' }, { status: 400 })
  }

  // For T-shirts, designName and blankType are required
  if (productType === 'TShirt') {
    if (!designName || typeof designName !== 'string' || designName.trim() === '') {
      return NextResponse.json({ error: 'Design name is required for T-shirts' }, { status: 400 })
    }
    if (!blankType || typeof blankType !== 'string' || blankType.trim() === '') {
      return NextResponse.json({ error: 'Blank type is required for T-shirts' }, { status: 400 })
    }
  }

const allowedTypes = ['TShirt', 'Hat', 'Diecast', 'Other'];
const typeValue = allowedTypes.includes(productType) ? productType : 'Other';

const order = await prisma.order.create({
  data: {
    title: title.trim(),
    sku: sku.trim(),
    productType: typeValue, // enforce enum value
    designName: designName?.trim() || null,
    blankType: blankType?.trim() || null,
    itemQuantity: itemQuantity ?? 0,
    expectedDate: new Date(expectedDate),
    status: 'Draft',
  },
})

  return NextResponse.json(order, { status: 201 })
}
