import React, { useCallback, useMemo } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import withSizes from 'react-sizes'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts'
import ProjectIcon from '../../../components/ProjectIcon/ProjectIcon'
import { useChartColors } from '../../Chart/colors'
import { mapSizesToProps } from '../../../utils/withSizes'
import { tooltipValueFormatter } from '../../dataHub/metrics/formatters'
import { SanWatermark } from './resources'
import styles from './ProjectsBarChart.module.scss'

const renderCustomizedLabel = props => {
  const { x, y, width, data, index } = props
  const { value } = data[index]
  const fontSize = width < 20 ? 7 : 12
  const position = +value >= 0 ? -1 * (fontSize / 2) : fontSize

  return (
    <g>
      <text
        x={x + width / 2}
        y={y + position}
        fill={'var(--rhino)'}
        textAnchor='middle'
        fontSize={fontSize}
        fontWeight={500}
      >
        {tooltipValueFormatter({
          value
        })}
      </text>
    </g>
  )
}

const PREDEFINED_COLORS = {
  tether: '#50AF95',
  'gemini-dollar': '#00DCFA',
  'binance-usd': '#F0B90B'
}

const DESKTOP_MARGIN = { top: 20, right: 0, left: -20, bottom: 50 }
const MOBILE_MARGIN = { top: 0, right: 16, left: 0, bottom: 50 }

const ProjectsBarChart = ({
  isDesktop,
  data,
  dataKey = 'value',
  redirect,
  settings: { yTickFormatter = v => v } = {}
}) => {
  const onProjectClick = useCallback(
    e => {
      const { value, index } = e

      const { clickable = true } = data[index] || {}

      if (!clickable) {
        return
      }

      return redirect(`/projects/${value}`)
    },
    [redirect, data]
  )

  const fakeMetrics = useMemo(
    () => {
      return data.map(item => ({
        key: item.slug
      }))
    },
    [data]
  )

  const MetricColor = useChartColors(fakeMetrics, PREDEFINED_COLORS)

  return (
    <div className={styles.chart}>
      <div className={styles.watermark}>{SanWatermark}</div>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          cursor='pointer'
          data={data}
          margin={isDesktop ? DESKTOP_MARGIN : MOBILE_MARGIN}
        >
          {isDesktop && (
            <CartesianGrid vertical={false} stroke='var(--porcelain)' />
          )}

          <YAxis
            dataKey={dataKey}
            fontSize={10}
            fontWeight={500}
            stroke={'var(--casper)'}
            tickCount={6}
            tickFormatter={yTickFormatter}
            hide={!isDesktop}
          />

          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} maxBarSize={32}>
            <LabelList
              dataKey={dataKey}
              content={props => renderCustomizedLabel({ ...props, data })}
            />
            {data.map((entry, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={MetricColor[entry.slug]}
                  onClick={() =>
                    onProjectClick({ ...entry, value: entry.slug })
                  }
                />
              )
            })}
          </Bar>

          <XAxis
            dataKey={'slug'}
            tick={props => <CategoryTick {...props} data={data} />}
            minTickGap={8}
            interval={0}
            domain={['auto', 'auto']}
            tickLine={false}
            axisLine={isDesktop}
            height={40}
            textAnchor='end'
            verticalAnchor='end'
            onClick={onProjectClick}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const CategoryTick = props => {
  const {
    x,
    y,
    payload: { value },
    data,
    index
  } = props
  const { ticker } = data[index] || {}
  return (
    <foreignObject x={x - 35} y={y} width={70} height={80}>
      <div className={styles.name}>
        <ProjectIcon slug={value} size={30} />
        <div className={styles.ticker}>{ticker}</div>
      </div>
    </foreignObject>
  )
}

const mapDispatchToProps = dispatch => ({
  redirect: route => {
    dispatch(push(route))
  }
})

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withSizes(mapSizesToProps)
)(ProjectsBarChart)
