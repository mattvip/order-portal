import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Order Portal',
  description: 'B2B Order Management Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <Link href="/" className="nav-brand">Order Portal</Link>
          <Link href="/orders" className="nav-link">My Orders</Link>
          <Link href="/manufacturer/orders" className="nav-link">Manufacturer View</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
