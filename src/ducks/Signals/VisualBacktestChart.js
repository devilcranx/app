import React from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts'
import { generateMetricsMarkup } from './../SANCharts/utils'
import { formatNumber, labelFormatter } from './../../utils/formatting'
import { getDateFormats } from '../../utils/dates'

const mapWithTimeseries = items =>
  items.map(item => ({ ...item, datetime: +new Date(item.datetime) }))

const VisualBacktestChart = ({ data, price, metrics, showXY = false }) => {
  const formattedPrice = mapWithTimeseries(price)
  const formattedData = mapWithTimeseries(data)

  const renderChart = () => {
    return (
      <ComposedChart
        data={formattedPrice}
        margin={{
          left: -40,
          bottom: 10
        }}
      >
        <XAxis
          dataKey='datetime'
          type='number'
          scale='time'
          tickLine
          allowDataOverflow
          tickFormatter={timeStr => {
            const { MMM, YY } = getDateFormats(new Date(timeStr))
            return `${MMM} ${YY}`
          }}
          domain={['dataMin', 'dataMax']}
          hide={!showXY}
        />

        <YAxis hide />

        {generateMetricsMarkup(metrics, {
          active_addresses: formattedData,
          price_volume_diff: formattedData
        })}

        {formattedData
          .filter(point => point['triggered?'])
          .map(point => (
            <ReferenceLine
              key={point.datetime}
              stroke='green'
              x={point.datetime}
            />
          ))}
        <Tooltip labelFormatter={labelFormatter} content={<CustomTooltip />} />
      </ComposedChart>
    )
  }

  return (
    <ResponsiveContainer width='100%' height='100%'>
      {renderChart()}
    </ResponsiveContainer>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload[0]) {
    const priceValue = payload[0].payload.price
      ? formatNumber(payload[0].payload.price, { currency: 'USD' })
      : undefined

    return (
      <div
        className='custom-tooltip'
        style={{
          margin: 0,
          padding: 10,
          backgroundColor: 'rgb(255, 255, 255)',
          border: '1px solid rgb(204, 204, 204)',
          whiteSpace: 'nowrap'
        }}
      >
        <p className='label'>{`${payload[0].name} : ${payload[0].value}`}</p>
        {priceValue && <p className='price'>{`Price : ${priceValue}`}</p>}
      </div>
    )
  }

  return ''
}

export default VisualBacktestChart
