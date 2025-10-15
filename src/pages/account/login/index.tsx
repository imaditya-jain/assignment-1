import Link from 'next/link'
import { AuthLayout, LoginForm } from '@/components'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clearState } from '@/lib/slices/auth.slice'

const Login = () => {
  const { message, error } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    if (message) {
      if (!error) {
        try { sessionStorage.setItem('email', sessionStorage.getItem('email') || '') } catch { }
        dispatch(clearState())
        router.push('/account/verify-otp')
      } else {
        dispatch(clearState())
      }
    }
  }, [message, error, dispatch, router])

  return (
    <>
      <AuthLayout>
        <div className='flex flex-col gap-6'>
          <h2 className='text-[20px] md:text-[24px] font-[600] uppercase text-center'>Sign In</h2>
          <div>
            <LoginForm />
          </div>
          <div className='flex items-center justify-between'>
            <p className='font-[500]'>Create new account.<Link href='/account/register/' legacyBehavior><a className="hover:text-[var(--color-primary)]">Sign Up</a></Link></p>
            <p className='font-[500]'><Link href='/account/forgot-password/' legacyBehavior><a className="hover:text-[var(--color-primary)]">Forgot Password</a></Link></p>

          </div>
        </div>
      </AuthLayout>
    </>
  )
}

export default Login