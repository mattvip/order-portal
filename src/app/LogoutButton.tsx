'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Proceed with redirect even if the API call fails
    }
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn-secondary"
      style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem' }}
    >
      Log out
    </button>
  )
}
