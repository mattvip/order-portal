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

  const allowedTypes = ['TShirt', 'Sweatshirt', 'Jacket', 'Hat', 'Diecast', 'Other'] as const;
const SIZE_PRODUCT_TYPES = [ProductType.TShirt, ProductType.Sweatshirt, ProductType.Jacket]; // <- use enums

const typeValue: ProductType = allowedTypes.includes(productType as any)
  ? productType as ProductType
  : 'Other';

const data: any = {
  title: title.trim(),
  sku: sku?.trim() || null,
  productType: typeValue,
  designName: designName?.trim() || null,
  blankType: blankType?.trim() || null,
  expectedDate: expectedDate ? new Date(expectedDate) : null,
  status: 'Draft',
};

if (SIZE_PRODUCT_TYPES.includes(typeValue)) { // NO error now!
  data.itemQuantity = 0;
  data.qtySmall = Number.isInteger(qtySmall) ? qtySmall : 0;
  data.qtyMedium = Number.isInteger(qtyMedium) ? qtyMedium : 0;
  data.qtyLarge = Number.isInteger(qtyLarge) ? qtyLarge : 0;
  data.qtyXL = Number.isInteger(qtyXL) ? qtyXL : 0;
  data.qty2X = Number.isInteger(qty2X) ? qty2X : 0;
  data.qty3X = Number.isInteger(qty3X) ? qty3X : 0;
  data.qty4X = Number.isInteger(qty4X) ? qty4X : 0;
} else {
  data.itemQuantity = Number.isInteger(itemQuantity) ? itemQuantity : 0;
  data.qtySmall = null;
  data.qtyMedium = null;
  data.qtyLarge = null;
  data.qtyXL = null;
  data.qty2X = null;
  data.qty3X = null;
  data.qty4X = null;
}

  const order = await prisma.order.create({ data });

  return NextResponse.json(order, { status: 201 });
}
