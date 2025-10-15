"use client"

import Link from 'next/link'
import { AuthLayout, ResetPasswordForm } from '@/components'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    const getEmail = sessionStorage.getItem('email')
    if (!getEmail) {
      router.push('/account/forgot-password')
    } else {
      setEmail(getEmail)
    }
  }, [router])
  return (
    <>
      <AuthLayout>
        <div className='flex flex-col gap-6'>
          <h2 className='text-[20px] md:text-[24px] font-[600] uppercase text-center'>Reset Password</h2>
          <div>
            <ResetPasswordForm email={email} />
          </div>
          <div className='flex items-center justify-between'>
            <Link href="/account/login/" legacyBehavior><a className='font-[500] hover:text-[var(--color-primary)]'>Back</a></Link>
          </div>
        </div>
      </AuthLayout>
    </>
  )
}

export default ResetPassword