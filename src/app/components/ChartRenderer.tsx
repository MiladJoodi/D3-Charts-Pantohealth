'use client'

import * as d3 from 'd3'
import { useEffect, useRef } from 'react'
import { ChartData, MultiPoint, SinglePoint } from './types'

type Props = {
  chart: ChartData
}

export function ChartRenderer({ chart }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const isMulti = Array.isArray(chart.data[0][1])
  const colors = ['blue', 'green', 'red']
  const seriesLabels = ['Cable 1', 'Cable 2', 'Cable 3']

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return

    const width = 600
    const height = 200
    const margin = { top: 40, right: 20, bottom: 30, left: 50 }

    d3.select(svgRef.current).selectAll('*').remove()
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const extent = d3.extent(chart.data as SinglePoint[], d => d[0])
    const xDomain: [number, number] = [extent[0] ?? 0, extent[1] ?? 1]
    const xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right])

    // محور X
    svg
      .append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6))

    const showTooltip = (x: number, y: number, text: string) => {
      const tooltip = tooltipRef.current
      if (!tooltip) return
      tooltip.style.opacity = '1'
      tooltip.style.left = `${x + 10}px`
      tooltip.style.top = `${y + 10}px`
      tooltip.innerHTML = text
    }

    const hideTooltip = () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = '0'
      }
    }

    if (!isMulti) {
      const cleanData = (chart.data as SinglePoint[]).filter(d => d[1] !== null)
      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(cleanData, d => d[1] as number) as [number, number])
        .range([height - margin.bottom, margin.top])

      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(6))

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

      svg
        .selectAll('.dot')
        .data(cleanData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d[0]))
        .attr('cy', d => yScale(d[1] as number))
        .attr('r', 3)
        .attr('fill', 'steelblue')
        .on('mousemove', (event, d) => {
          const [x, y] = d3.pointer(event)
          showTooltip(x, y, `x: ${d[0]}<br />y: ${d[1]}`)
        })
        .on('mouseleave', hideTooltip)
    } else {
      const seriesCount = (chart.data[0][1] as (number | null)[]).length

      let allYValues: number[] = []
      for (let i = 0; i < seriesCount; i++) {
        const vals = (chart.data as MultiPoint[])
          .map(d => d[1][i])
          .filter((v): v is number => v !== null)
        allYValues = allYValues.concat(vals)
      }

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(allYValues) as [number, number])
        .range([height - margin.bottom, margin.top])

      svg
        .append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(6))

      for (let i = 0; i < seriesCount; i++) {
        const seriesData = (chart.data as MultiPoint[])
          .map(d => [d[0], d[1][i]])
          .filter(([_, val]) => val !== null) as [number, number][]

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

        svg
          .selectAll(`.dot-series-${i}`)
          .data(seriesData)
          .enter()
          .append('circle')
          .attr('cx', d => xScale(d[0]))
          .attr('cy', d => yScale(d[1]))
          .attr('r', 3)
          .attr('fill', colors[i])
          .on('mousemove', (event, d) => {
            const [x, y] = d3.pointer(event)
            showTooltip(x, y, `x: ${d[0]}<br />y: ${d[1]}`)
          })
          .on('mouseleave', hideTooltip)
      }

      // Legend
      const legendGroup = svg.append('g').attr('transform', `translate(${margin.left}, 10)`)

      colors.forEach((color, i) => {
        const legendItem = legendGroup.append('g').attr('transform', `translate(${i * 120}, 0)`)

        legendItem
          .append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', color)

        legendItem
          .append('text')
          .attr('x', 24)
          .attr('y', 14)
          .text(seriesLabels[i])
          .style('font-size', '12px')
          .style('fill', '#333')
      })
    }
  }, [chart, isMulti])

  return (
    <div className="mb-8 relative">
      <h2 className="text-lg font-semibold mb-2">📉 {chart.title}</h2>
      <svg ref={svgRef} />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute bg-white border border-gray-300 text-xs rounded px-2 py-1 shadow-sm"
        style={{ opacity: 0 }}
      />
    </div>
  )
}
