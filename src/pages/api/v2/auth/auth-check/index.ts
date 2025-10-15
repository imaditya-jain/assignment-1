import connectToDatabase from '@/server/db/connect'
import { Users } from '@/server/models'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()
  try {
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' })

    const accessToken = req.cookies.accessToken

    if (!accessToken) return res.status(401).json({ success: false, error: 'No access token provided.' })

    if (!process.env.ACCESS_TOKEN_SECRET) return res.status(500).json({ success: false, error: 'Server misconfigured.' })

    let decoded: { _id: string }
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as { _id: string }
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired access token.' })
    }

    const user = await Users.findById(decoded._id)
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' })

    return res.status(200).json({ success: true, data: { user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }, accessToken } })
  } catch {
    return res.status(500).json({ success: false, error: 'Internal server error.' })
  }
}
