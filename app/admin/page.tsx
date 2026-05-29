'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Users, MapPin, BarChart2, LogOut, Eye, RefreshCw, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/Logo'

type Lead = { id: string; name: string; email: string; source: string; created_at: string; location?: string }
type Event = { page: string; event_type: string; duration_s?: number; created_at: string }

// ── Passcode validation (server-first, client fallback) ───────
// Stored reversed so plaintext isn't immediately readable in source
const _R = '7492830561849273'
function _check(input: string) {
  return input.replace(/-/g, '').trim() === _R.split('').reverse().join('')
}

function PasscodeScreen({ onAuth }: { onAuth: (token: string) => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function formatCode(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1-')
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const normalized = code.replace(/-/g, '').trim()

    try {
      // Try server-side verification first
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized }),
      })

      if (res.status === 503) {
        // Server env not configured — client-side fallback
        if (_check(normalized)) {
          const token = btoa(`admin:${Date.now()}:local`)
          sessionStorage.setItem('bp_admin_token', token)
          onAuth(token)
        } else {
          setError('Wrong code. Try again.')
        }
        return
      }

      const data = await res.json()
      if (!res.ok) {
        setError('Wrong code. Try again.')
        return
      }

      sessionStorage.setItem('bp_admin_token', data.token)
      onAuth(data.token)
    } catch {
      // Network failure — client-side fallback
      if (_check(normalized)) {
        const token = btoa(`admin:${Date.now()}:local`)
        sessionStorage.setItem('bp_admin_token', token)
        onAuth(token)
      } else {
        setError('Wrong code. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="default" dark />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck size={22} className="text-white/70" />
            </div>
          </div>

          <p className="font-serif text-xl font-semibold text-white text-center mb-1">Admin Access</p>
          <p className="text-sm text-white/40 text-center mb-8">16-digit access code</p>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(formatCode(e.target.value))}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              maxLength={19}
              required
              autoComplete="off"
              className="w-full px-4 py-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/25 text-center tracking-[0.25em] text-lg font-mono focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
            />
            {error && (
              <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-white text-navy font-bold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 text-sm"
            >
              {loading ? 'Verifying…' : 'Enter Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-white/25 text-xs hover:text-white/50 transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'leads' | 'analytics'>('leads')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/data', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { onLogout(); return }
      const data = await res.json()
      setLeads(Array.isArray(data.leads) ? data.leads : [])
      setEvents(Array.isArray(data.events) ? data.events : [])
    } catch { /* keep empty state */ }
    finally { setLoading(false) }
  }, [token, onLogout])

  useEffect(() => { load() }, [load])

  function downloadCSV(rows: object[], filename: string) {
    if (!rows.length) return
    const keys = Object.keys(rows[0])
    const csv = [
      keys.join(','),
      ...rows.map((r) => keys.map((k) => JSON.stringify((r as Record<string, unknown>)[k] ?? '')).join(',')),
    ].join('\n')
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: filename,
    })
    a.click()
    URL.revokeObjectURL(a.href)
  }

  function byDays(arr: Lead[], d: number) {
    const cut = Date.now() - d * 86400000
    return arr.filter((r) => new Date(r.created_at).getTime() > cut)
  }

  // Analytics: average time per page
  const pageStats = events.reduce<Record<string, { views: number; totalTime: number }>>((acc, e) => {
    if (!acc[e.page]) acc[e.page] = { views: 0, totalTime: 0 }
    acc[e.page].views++
    if (e.duration_s) acc[e.page].totalTime += e.duration_s
    return acc
  }, {})

  const maxAvg = Math.max(...Object.values(pageStats).map((p) => p.totalTime / Math.max(p.views, 1)), 1)

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <header className="bg-navy text-white px-6 lg:px-10 py-4 flex items-center justify-between">
        <Logo size="sm" dark />
        <div className="flex items-center gap-4">
          <button onClick={load} aria-label="Refresh" className="text-white/50 hover:text-white transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads', value: leads.length, Icon: Users },
            { label: 'This Week', value: byDays(leads, 7).length, Icon: Eye },
            { label: 'Today', value: byDays(leads, 1).length, Icon: MapPin },
            { label: 'Page Events', value: events.length, Icon: BarChart2 },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-warm-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-navy/40" />
                <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{label}</p>
              </div>
              <p className="font-serif text-3xl font-semibold text-charcoal">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-warm-border rounded-xl p-1 w-fit">
          {(['leads', 'analytics'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-navy text-white shadow-sm' : 'text-charcoal/55 hover:text-charcoal'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Leads tab */}
        {tab === 'leads' && (
          <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm-border">
              <p className="font-semibold text-charcoal text-sm">Leads ({leads.length})</p>
              <div className="flex gap-2">
                {[['Daily', 1], ['Weekly', 7], ['Monthly', 30]].map(([label, days]) => (
                  <button
                    key={label as string}
                    onClick={() => downloadCSV(byDays(leads, days as number), `leads-${String(label).toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-navy border border-navy/20 rounded-lg hover:bg-navy hover:text-white transition-all"
                  >
                    <Download size={11} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-charcoal/30 text-sm">Loading…</div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Users size={28} className="text-charcoal/15" />
                <p className="text-sm text-charcoal/40 text-center max-w-xs">
                  No leads yet. Add your Supabase env vars to start collecting real data.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F1EB]">
                      {['Name', 'Email', 'Location', 'Source', 'Date'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-border">
                    {leads.map((lead, i) => (
                      <tr key={lead.id ?? i} className="hover:bg-[#FAF8F4] transition-colors">
                        <td className="px-5 py-3.5 font-medium text-charcoal">{lead.name || '—'}</td>
                        <td className="px-5 py-3.5 text-charcoal/65">{lead.email}</td>
                        <td className="px-5 py-3.5 text-charcoal/50 text-xs">{lead.location || '—'}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] bg-navy/8 text-navy px-2 py-0.5 rounded-full font-medium">{lead.source}</span>
                        </td>
                        <td className="px-5 py-3.5 text-charcoal/40 text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics tab */}
        {tab === 'analytics' && (
          <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-border">
              <p className="font-semibold text-charcoal text-sm">Page Analytics</p>
              <p className="text-xs text-charcoal/40 mt-0.5">Average time on page (seconds) · total views</p>
            </div>

            {Object.keys(pageStats).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <BarChart2 size={28} className="text-charcoal/15" />
                <p className="text-sm text-charcoal/40 text-center max-w-xs">
                  No analytics yet. PageTracker fires automatically when visitors browse the site.
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {Object.entries(pageStats)
                  .sort((a, b) => b[1].views - a[1].views)
                  .map(([page, stat]) => {
                    const avg = Math.round(stat.totalTime / Math.max(stat.views, 1))
                    const pct = (avg / maxAvg) * 100
                    return (
                      <div key={page}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-charcoal/70">{page}</span>
                          <span className="text-charcoal/40 text-xs">{avg}s avg · {stat.views} views</span>
                        </div>
                        <div className="h-2 bg-warm-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-navy/70 rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

// ── Entry point ───────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('bp_admin_token')
    if (stored) setToken(stored)
  }, [])

  function logout() {
    sessionStorage.removeItem('bp_admin_token')
    setToken(null)
  }

  if (!token) return <PasscodeScreen onAuth={setToken} />
  return <Dashboard token={token} onLogout={logout} />
}
