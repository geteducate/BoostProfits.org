'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Users, Mail, MapPin, BarChart2, LogOut, Eye, RefreshCw } from 'lucide-react'

type Lead = { id: string; name: string; email: string; source: string; created_at: string; location?: string }
type Event = { id: string; page: string; event_type: string; duration_s?: number; created_at: string }

// ──────────────────────────────────────────────────────────────
//  PASSCODE SCREEN
// ──────────────────────────────────────────────────────────────
function PasscodeScreen({ onAuth }: { onAuth: (token: string) => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) { setError('Wrong code. Try again.'); return }
      sessionStorage.setItem('bp_admin_token', data.token)
      onAuth(data.token)
    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-serif text-2xl font-semibold text-white text-center mb-2">Admin Access</p>
        <p className="text-sm text-white/40 text-center mb-10">Enter your 16-digit access code</p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            maxLength={19}
            required
            className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-center tracking-[0.2em] text-lg font-mono focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-navy font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>

        <p className="text-center mt-8">
          <a href="/" className="text-white/25 text-xs hover:text-white/50 transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
//  DASHBOARD
// ──────────────────────────────────────────────────────────────
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
      setLeads(data.leads ?? [])
      setEvents(data.events ?? [])
    } finally {
      setLoading(false)
    }
  }, [token, onLogout])

  useEffect(() => { load() }, [load])

  function downloadCSV(rows: object[], filename: string) {
    if (!rows.length) return
    const headers = Object.keys(rows[0])
    const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => JSON.stringify((r as Record<string, unknown>)[h] ?? '')).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function filterByDays(arr: Lead[], days: number) {
    const cutoff = Date.now() - days * 86400000
    return arr.filter((r) => new Date(r.created_at).getTime() > cutoff)
  }

  // Analytics aggregation
  const pageTime = events.reduce<Record<string, number[]>>((acc, e) => {
    if (e.duration_s) (acc[e.page] = acc[e.page] ?? []).push(e.duration_s)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* Top bar */}
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between">
        <p className="font-serif text-lg font-semibold">BoostProfits Admin</p>
        <div className="flex items-center gap-4">
          <button onClick={load} className="text-white/50 hover:text-white transition-colors" aria-label="Refresh">
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
            { label: 'This Week', value: filterByDays(leads, 7).length, Icon: Mail },
            { label: 'Today', value: filterByDays(leads, 1).length, Icon: Eye },
            { label: 'Page Events', value: events.length, Icon: BarChart2 },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-warm-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className="text-navy/40" />
                <p className="text-xs font-semibold text-charcoal/45 uppercase tracking-widest">{label}</p>
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
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-navy text-white' : 'text-charcoal/55 hover:text-charcoal'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'leads' && (
          <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-warm-border">
              <p className="font-semibold text-charcoal">Leads</p>
              <div className="flex gap-2">
                {[['Daily', 1], ['Weekly', 7], ['Monthly', 30]].map(([label, days]) => (
                  <button
                    key={label as string}
                    onClick={() => downloadCSV(filterByDays(leads, days as number), `leads-${label.toString().toLowerCase()}.csv`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-navy border border-navy/20 rounded-lg hover:bg-navy hover:text-white transition-all"
                  >
                    <Download size={11} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-charcoal/35 text-sm">Loading…</div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Users size={24} className="text-charcoal/20" />
                <p className="text-sm text-charcoal/35">No leads yet. Configure Supabase to start collecting.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F5F1EB]">
                      {['Name', 'Email', 'Location', 'Source', 'Date'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-charcoal/40 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-border">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#FAF8F4] transition-colors">
                        <td className="px-5 py-3.5 font-medium text-charcoal">{lead.name || '—'}</td>
                        <td className="px-5 py-3.5 text-charcoal/65">{lead.email}</td>
                        <td className="px-5 py-3.5 text-charcoal/50">
                          <span className="flex items-center gap-1"><MapPin size={11} />{lead.location || '—'}</span>
                        </td>
                        <td className="px-5 py-3.5"><span className="text-[11px] bg-navy/8 text-navy px-2 py-0.5 rounded-full">{lead.source}</span></td>
                        <td className="px-5 py-3.5 text-charcoal/40 text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'analytics' && (
          <div className="bg-white rounded-2xl border border-warm-border overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-border">
              <p className="font-semibold text-charcoal">Time on Page (avg seconds)</p>
            </div>
            {Object.keys(pageTime).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <BarChart2 size={24} className="text-charcoal/20" />
                <p className="text-sm text-charcoal/35">No page events yet. Analytics populate once visitors are tracked.</p>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {Object.entries(pageTime)
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([page, durations]) => {
                    const avg = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
                    const max = Math.max(...Object.values(pageTime).map((d) => Math.round(d.reduce((a, b) => a + b, 0) / d.length)))
                    return (
                      <div key={page}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-charcoal/70 font-medium">{page}</span>
                          <span className="text-charcoal/45">{avg}s avg · {durations.length} views</span>
                        </div>
                        <div className="h-2 bg-warm-border rounded-full overflow-hidden">
                          <div className="h-full bg-navy/70 rounded-full" style={{ width: `${(avg / max) * 100}%` }} />
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

// ──────────────────────────────────────────────────────────────
//  MAIN PAGE
// ──────────────────────────────────────────────────────────────
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
