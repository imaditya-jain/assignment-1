import Link from 'next/link'
import { AuthLayout, ForgotPasswordForm } from '@/components'
import { useAppSelector } from '@/lib/hooks'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ForgotPassword = () => {
  const { message, error } = useAppSelector((s) => s.auth)
  const router = useRouter()

  useEffect(() => {
    if (message && !error) {
      router.push('/account/reset-password')
    }
  }, [message, error, router])

  return (
    <>
      <AuthLayout>
        <div className='flex flex-col'>
          <h2 className='text-[20px] md:text-[24px] font-[600] uppercase text-center'>Forgot Password</h2>
          <div>
            <ForgotPasswordForm />
          </div>
          <div className='flex items-center justify-between'>
            <Link href="/auth/login/" legacyBehavior><a className='font-[500] hover:text-[var(--color-primary)]'>Back</a></Link>
          </div>
        </div>
      </AuthLayout>
    </>
  )
}

export default ForgotPassword