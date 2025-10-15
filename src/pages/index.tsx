"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { logoutHandler } from '@/lib/features/auth.features'

const Home = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, initialized } = useAppSelector((s) => s.auth)

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push('/account/login')
    }
  }, [initialized, isAuthenticated, router])

  if (!initialized) return null
  if (!isAuthenticated) return null

  const handleLogout = async () => {
    await dispatch(logoutHandler())
    router.push('/account/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-[35rem] flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-center">Welcome, {user ? `${user.firstName} ${user.lastName}` : 'User'}</h2>
        <button
          className="mt-2 bg-[var(--color-primary)] text-white font-semibold py-1 px-3 rounded text-sm"
          onClick={handleLogout}

          style={{ marginTop: '8px', padding: "4px 12px" }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home