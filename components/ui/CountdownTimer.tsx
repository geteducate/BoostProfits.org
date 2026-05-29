'use client'

import { useState, useEffect } from 'react'

interface TimeLeft { hours: number; minutes: number; seconds: number }

function getNextMidnight(): Date {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(23, 59, 59, 0)
  if (now >= midnight) {
    midnight.setDate(midnight.getDate() + 1)
    midnight.setHours(23, 59, 59, 0)
  }
  return midnight
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-bold tracking-tight tabular-nums text-white font-mono">
        {pad(value)}
      </span>
      <span className="text-[10px] font-semibold tracking-widest text-white/35 uppercase mt-1">{label}</span>
    </div>
  )
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = getNextMidnight()
    const update = () => setTimeLeft(calcTimeLeft(target))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-center gap-4">
      <TimeUnit value={timeLeft.hours} label="hrs" />
      <span className="text-3xl font-light text-white/20 mb-3">:</span>
      <TimeUnit value={timeLeft.minutes} label="min" />
      <span className="text-3xl font-light text-white/20 mb-3">:</span>
      <TimeUnit value={timeLeft.seconds} label="sec" />
    </div>
  )
}
