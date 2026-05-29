import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function verifyToken(token: string, secret: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const lastDot = decoded.lastIndexOf('.')
    const payload = decoded.substring(0, lastDot)
    const sig = decoded.substring(lastDot + 1)
    const expected = createHmac('sha256', secret).update(payload).digest('hex')
    if (sig !== expected) return false
    // Token valid for 8 hours
    const ts = parseInt(payload.split(':')[1], 10)
    return Date.now() - ts < 8 * 3600 * 1000
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? ''
  const secret = process.env.ADMIN_JWT_SECRET ?? ''

  if (!verifyToken(token, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    // Return empty mock data if Supabase not configured
    return NextResponse.json({ leads: [], events: [] })
  }

  const [leadsRes, eventsRes] = await Promise.all([
    fetch(`${supabaseUrl}/rest/v1/leads?order=created_at.desc&limit=500`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    }),
    fetch(`${supabaseUrl}/rest/v1/page_events?order=created_at.desc&limit=1000`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    }),
  ])

  const leads = leadsRes.ok ? await leadsRes.json() : []
  const events = eventsRes.ok ? await eventsRes.json() : []

  return NextResponse.json({ leads, events })
}
