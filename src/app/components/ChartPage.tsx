'use client'

import { useEffect, useState } from 'react'
import { ChartRenderer } from './ChartRenderer'
import { LoadingChart } from './LoadingChart'
import { ChartData } from './types'

export function ChartPage() {
    const [charts, setCharts] = useState<ChartData[]>([])
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
                await new Promise(res => setTimeout(res, 1500)); //sleep
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading)
        return (
            <LoadingChart />
        )


    if (error) return <p className="text-red-600">{error}</p>

    return (
        <>
            {charts.map((chart, i) => (
                <ChartRenderer key={i} chart={chart} />
            ))}
        </>
    )
}
