import nodemailer from 'nodemailer'

interface Order {
  id: number
  title: string
  sku: string | null
  productType: string
  designName?: string | null
  blankType?: string | null
  itemQuantity: number
  expectedDate: string | Date | null
  status: string
  qtySmall?: number | null
  qtyMedium?: number | null
  qtyLarge?: number | null
  qtyXL?: number | null
  qty2X?: number | null
  qty3X?: number | null
  qty4X?: number | null
}

export const sendOrderNotification = async (order: Order) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Build email body based on product type
  let productDetails = ''

  if (order.productType === 'TShirt') {
    const sizes = [
      { label: 'Small', value: order.qtySmall },
      { label: 'Medium', value: order.qtyMedium },
      { label: 'Large', value: order.qtyLarge },
      { label: 'XL', value: order.qtyXL },
      { label: '2XL', value: order.qty2X },
      { label: '3XL', value: order.qty3X },
      { label: '4XL', value: order.qty4X },
    ]
    // Only show sizes with a positive value
    const sizeRows = sizes
      .filter(s => s.value && s.value > 0)
      .map(s => `<tr><td><strong>${s.label}</strong></td><td>${s.value}</td></tr>`)
      .join('')
    productDetails = `
      <tr><td><strong>Design Name</strong></td><td>${order.designName || 'N/A'}</td></tr>
      <tr><td><strong>Blank Type</strong></td><td>${order.blankType || 'N/A'}</td></tr>
      <tr><td><strong>Total Quantity</strong></td><td>${order.itemQuantity}</td></tr>
      ${sizeRows}
    `
  } else if (['Hat', 'Diecast'].includes(order.productType)) {
    productDetails = `
      <tr><td><strong>Product Type</strong></td><td>${order.productType}</td></tr>
      <tr><td><strong>Blank Type</strong></td><td>${order.blankType || 'N/A'}</td></tr>
      <tr><td><strong>Quantity</strong></td><td>${order.itemQuantity}</td></tr>
    `
  } else {
    productDetails = `
      <tr><td><strong>Product Type</strong></td><td>${order.productType}</td></tr>
      <tr><td><strong>Quantity</strong></td><td>${order.itemQuantity}</td></tr>
    `
  }

  let expectedDate = 'N/A'
  if (order.expectedDate) {
    const dt = order.expectedDate instanceof Date
      ? order.expectedDate
      : new Date(order.expectedDate)
    expectedDate = isNaN(dt.getTime()) ? 'N/A' : dt.toLocaleDateString()
  }

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>New Order Submission</h2>
        <table border="1" cellpadding="10" style="border-collapse: collapse;">
          <tr><td><strong>Order ID</strong></td><td>#${order.id}</td></tr>
          <tr><td><strong>Title</strong></td><td>${order.title}</td></tr>
          <tr><td><strong>SKU</strong></td><td>${order.sku}</td></tr>
          ${productDetails}
          <tr><td><strong>Expected Delivery Date</strong></td><td>${expectedDate}</td></tr>
        </table>
      </body>
    </html>
  `

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.VENDOR_EMAIL,
    subject: 'Carson Hocevar New Order Submission',
    html: htmlContent,
  }

  await transporter.sendMail(mailOptions)
}
