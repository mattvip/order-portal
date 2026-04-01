import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const correct = process.env.PORTAL_PASSWORD
  if (!correct) {
    return NextResponse.json(
      { error: 'Server is not configured with a password.' },
      { status: 500 }
    )
  }

  // Use constant-time comparison to prevent timing attacks
  const passwordMatch =
    password != null &&
    password.length === correct.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(correct))

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('portal_auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // 7-day session
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
