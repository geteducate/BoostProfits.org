import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

// HMAC-signed token (issued by /api/admin/verify when configured)
function verifyHmacToken(token: string, secret: string): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const lastDot = decoded.lastIndexOf('.')
    const payload = decoded.substring(0, lastDot)
    const sig = decoded.substring(lastDot + 1)
    const expected = createHmac('sha256', secret).update(payload).digest('hex')
    if (sig !== expected) return false
    const ts = parseInt(payload.split(':')[1], 10)
    return !isNaN(ts) && Date.now() - ts < 8 * 3600 * 1000
  } catch {
    return false
  }
}

// Unsigned base64 token — ONLY trusted in dev/unconfigured mode (no data exposed)
function verifyFallbackToken(token: string): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const parts = decoded.split(':')
    if (parts[0] !== 'admin') return false
    const ts = parseInt(parts[1], 10)
    return !isNaN(ts) && Date.now() - ts < 8 * 3600 * 1000
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? ''
  const secret = process.env.ADMIN_JWT_SECRET
  const isConfigured = Boolean(secret && process.env.ADMIN_PASSCODE)

  // When the server has a real admin secret, ONLY accept HMAC-signed tokens.
  // The base64 fallback is permitted exclusively in unconfigured (dev) mode,
  // where there's no service key and the data returned is empty anyway.
  const ok = isConfigured
    ? verifyHmacToken(token, secret as string)
    : verifyFallbackToken(token)

  if (!ok) {
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
