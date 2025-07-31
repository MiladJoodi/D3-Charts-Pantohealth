'use client'

import { useEffect, useState } from 'react'
import { ChartRenderer } from './ChartRenderer'

type SinglePoint = [number, number | null]
type MultiPoint = [number, (number | null)[]]

type Chart = {
  title: string
  data: SinglePoint[] | MultiPoint[]
}

export function ChartPage() {
  const [charts, setCharts] = useState<Chart[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data.json')
        if (!res.ok) throw new Error('Failed to load data')
        const data = await res.json()
        setCharts(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Loading charts...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <>
      {charts.map((chart, i) => (
        <ChartRenderer key={i} chart={chart} />
      ))}
    </>
  )
}
