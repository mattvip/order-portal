import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ProductType } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const {
    title,
    sku,
    productType,
    designName,
    blankType,
    expectedDate,
    itemQuantity,
    qtySmall, qtyMedium, qtyLarge, qtyXL, qty2X, qty3X, qty4X,
  } = body

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!productType || typeof productType !== 'string') {
    return NextResponse.json({ error: 'Product type is required' }, { status: 400 })
  }

  // For T-shirts, designName is still required
  if (productType === 'TShirt') {
    if (!designName || typeof designName !== 'string' || designName.trim() === '') {
      return NextResponse.json({ error: 'Design name is required for T-shirts' }, { status: 400 })
    }
    // At least one T-shirt quantity must be > 0
    const sizes = [qtySmall, qtyMedium, qtyLarge, qtyXL, qty2X, qty3X, qty4X].map(
      q => Number.isInteger(q) ? q : 0
    );
    if (sizes.every(q => q <= 0)) {
      return NextResponse.json({ error: 'At least one T-shirt size must have a quantity > 0' }, { status: 400 })
    }
  } else {
    // For non-tshirts, check generic itemQuantity
    if (!Number.isInteger(itemQuantity) || itemQuantity < 1) {
      return NextResponse.json({ error: 'Quantity must be a positive integer' }, { status: 400 })
    }
  }

  const allowedTypes = ['TShirt', 'Hat', 'Diecast', 'Other'] as const;
  const typeValue: ProductType = allowedTypes.includes(productType as any)
    ? productType as ProductType
    : 'Other';

  const order = await prisma.order.create({
    data: {
      title: title.trim(),
      sku: sku?.trim() || null,
      productType: typeValue,
      designName: designName?.trim() || null,
      blankType: blankType?.trim() || null,
      expectedDate: expectedDate ? new Date(expectedDate) : null,
      itemQuantity: typeValue === 'TShirt' ? 0 : (itemQuantity ?? 0),
      qtySmall: typeValue === 'TShirt' ? (Number.isInteger(qtySmall) ? qtySmall : 0) : null,
      qtyMedium: typeValue === 'TShirt' ? (Number.isInteger(qtyMedium) ? qtyMedium : 0) : null,
      qtyLarge: typeValue === 'TShirt' ? (Number.isInteger(qtyLarge) ? qtyLarge : 0) : null,
      qtyXL: typeValue === 'TShirt' ? (Number.isInteger(qtyXL) ? qtyXL : 0) : null,
      qty2X: typeValue === 'TShirt' ? (Number.isInteger(qty2X) ? qty2X : 0) : null,
      qty3X: typeValue === 'TShirt' ? (Number.isInteger(qty3X) ? qty3X : 0) : null,
      qty4X: typeValue === 'TShirt' ? (Number.isInteger(qty4X) ? qty4X : 0) : null,
      status: 'Draft',
    },
  })

  return NextResponse.json(order, { status: 201 })
}
