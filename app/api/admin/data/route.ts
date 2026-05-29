import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function verifyToken(token: string, secret: string): boolean {
  if (!token) return false

  // 1. Try HMAC-signed token (server-generated)
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const lastDot = decoded.lastIndexOf('.')
    const payload = decoded.substring(0, lastDot)
    const sig = decoded.substring(lastDot + 1)
    const expected = createHmac('sha256', secret).update(payload).digest('hex')
    if (sig === expected) {
      const ts = parseInt(payload.split(':')[1], 10)
      return Date.now() - ts < 8 * 3600 * 1000
    }
  } catch { /* fall through */ }

  // 2. Try base64 fallback token (client-generated when env vars not set)
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const parts = decoded.split(':')
    if (parts[0] === 'admin') {
      const ts = parseInt(parts[1], 10)
      return !isNaN(ts) && Date.now() - ts < 8 * 3600 * 1000
    }
  } catch { /* invalid */ }

  return false
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? ''
  const secret = process.env.ADMIN_JWT_SECRET ?? 'bp_fallback_secret'

  if (!verifyToken(token, secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ leads: [], events: [] })
  }

  try {
    const [leadsRes, eventsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/leads?order=created_at.desc&limit=500`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      }),
      fetch(`${supabaseUrl}/rest/v1/page_events?order=created_at.desc&limit=2000`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      }),
    ])

    return NextResponse.json({
      leads: leadsRes.ok ? await leadsRes.json() : [],
      events: eventsRes.ok ? await eventsRes.json() : [],
    })
  } catch {
    return NextResponse.json({ leads: [], events: [] })
  }
}
