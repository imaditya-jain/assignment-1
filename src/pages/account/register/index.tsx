"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout, RegistrationForm } from '@/components'
import Link from "next/link"
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { toast } from "react-toastify"
import { clearState } from "@/lib/slices/auth.slice"

const Register = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { message, error } = useAppSelector((state) => state.auth)
  const [show, setShow] = React.useState(false)

  useEffect(() => {
    if (typeof window !== undefined) {
      setShow(true)
    }
  }, [])

  useEffect(() => {
    if (message) {
      if (error) {
        dispatch(clearState())
      } else {
        toast.success(message)
        dispatch(clearState())
        setTimeout(() => {
          router.push('/account/login')
        })
      }
    }
  }, [error, message, dispatch, router])

  return (
    <>
      <AuthLayout>
        {show && <div className='flex flex-col gap-6'>
          <h2 className='text-[20px] md:text-[24px] font-[600] uppercase text-center'>Create New Account</h2>
          <div>
            <RegistrationForm isEdit={false} user={null} />
          </div>
          <div>
            <p className='font-[500] text-center'>Already have an account? <Link href='/account/login/' legacyBehavior><a className="hover:text-[var(--color-primary)]">Log in</a></Link></p>
          </div>
        </div>}
      </AuthLayout>
    </>
  )
}

export default Register