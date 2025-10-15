"use client"

import { useEffect } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { authCheckHandler, refreshTokenHandler } from '@/lib/features/auth.features'

export default function AuthInit() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        let mounted = true

        const init = async () => {
            if (typeof window === 'undefined') return

            try {
                await dispatch(authCheckHandler()).unwrap()
            } catch {
                try {
                    await dispatch(refreshTokenHandler()).unwrap()
                    await dispatch(authCheckHandler()).unwrap()
                } catch {
                }
            }
        }

        if (mounted) {
            init()
        }

        return () => {
            mounted = false
        }
    }, [dispatch])

    return null
}
