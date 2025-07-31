'use client'

import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

type SinglePoint = [number, number | null]
type MultiPoint = [number, (number | null)[]]
type ChartData = {
  title: string
  data: SinglePoint[] | MultiPoint[]
}

type Props = {
  chart: ChartData
}

export function ChartRenderer({ chart }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const isMulti = Array.isArray(chart.data[0][1])
    const width = 600
    const height = 200
    const margin = { top: 20, right: 20, bottom: 20, left: 40 }

    d3.select(svgRef.current).selectAll('*').remove()
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const extent = d3.extent(chart.data as SinglePoint[], d => d[0])
    const xDomain: [number, number] = [
      extent[0] ?? 0,
      extent[1] ?? 1
    ]
    const xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right])

    if (!isMulti) {
      const cleanData = (chart.data as SinglePoint[]).filter(d => d[1] !== null)
      if (cleanData.length === 0) return

      const yExtent = d3.extent(cleanData, d => d[1] as number) as [number, number]
      const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height - margin.bottom, margin.top])

      const line = d3
        .line<SinglePoint>()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1] as number))

      svg
        .append('path')
        .datum(cleanData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line)
    } else {
      const colors = ['blue', 'green', 'red']
      const seriesCount = (chart.data[0][1] as (number | null)[]).length

      // همه مقادیر غیر null برای دامنه y کلی
      const allValues = (chart.data as MultiPoint[])
        .flatMap(d => d[1])
        .filter((v): v is number => v !== null)

      if (allValues.length === 0) return

      const yScale = d3
        .scaleLinear()
        .domain([Math.min(...allValues), Math.max(...allValues)])
        .range([height - margin.bottom, margin.top])

      for (let i = 0; i < seriesCount; i++) {
        const seriesData = (chart.data as MultiPoint[])
          .map(d => [d[0], d[1][i]])
          .filter(([_, val]) => val !== null) as [number, number][]

        if (seriesData.length === 0) continue

        const line = d3
          .line<[number, number]>()
          .x(d => xScale(d[0]))
          .y(d => yScale(d[1]))

        svg
          .append('path')
          .datum(seriesData)
          .attr('fill', 'none')
          .attr('stroke', colors[i])
          .attr('stroke-width', 1.5)
          .attr('d', line)
      }
    }
  }, [chart])

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">{chart.title}</h2>
      <svg ref={svgRef} />
    </div>
  )
}
