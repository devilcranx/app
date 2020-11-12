import React from 'react'
import { Area, AreaChart } from 'recharts'
import Gradients from '../../WatchlistOverview/Gradients'

const PriceGraph = ({ data = [] }) => {
  if (!data || data.length < 10) {
    return null
  }

  const minValue = Math.min(...data.map(({ value }) => value))
  const normalizedData = data.map(item => ({
    ...item,
    value: item.value - minValue
  }))

  const { value: latestValue } = normalizedData[normalizedData.length - 1]
  const { value } = normalizedData[0]

  const color = `var(--${latestValue >= value ? 'lima' : 'persimmon'})`

  return (
    <AreaChart data={normalizedData} height={35} width={90}>
      <defs>
        <Gradients />
      </defs>
      <Area
        dataKey='value'
        type='monotone'
        strokeWidth={2}
        stroke={color}
        fill={`url(#total${latestValue >= value ? 'Up' : 'Down'})`}
        isAnimationActive={false}
      />
    </AreaChart>
  )
}

export default PriceGraph