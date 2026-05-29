import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function makeToken(secret: string): string {
  const payload = `admin:${Date.now()}`
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return Buffer.from(`${payload}.${sig}`).toString('base64url')
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    const adminCode = process.env.ADMIN_PASSCODE
    const jwtSecret = process.env.ADMIN_JWT_SECRET

    if (!adminCode || !jwtSecret) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 503 })
    }

    // Strip dashes for comparison
    const normalized = String(code).replace(/-/g, '')
    const expected = adminCode.replace(/-/g, '')

    if (normalized !== expected) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
    }

    const token = makeToken(jwtSecret)
    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
