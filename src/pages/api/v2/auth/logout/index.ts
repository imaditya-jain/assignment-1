import connectToDatabase from '@/server/db/connect'
import { Users } from '@/server/models'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  try {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' })

    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    if (!accessToken && !refreshToken) return res.status(200).json({ success: true, message: 'Logged out.' })

    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { _id?: string }
        if (decoded && decoded._id) {
          await Users.findByIdAndUpdate(decoded._id, { refreshToken: null })
        }
      } catch {
      }
    }

    res.setHeader('Set-Cookie', [
      `accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`,
      `refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`,
    ])

    return res.status(200).json({ success: true, message: 'Logged out.' })
  } catch {
    return res.status(500).json({ success: false, error: 'Internal server error.' })
  }
}
