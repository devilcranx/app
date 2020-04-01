import React, { useState } from 'react'
import cx from 'classnames'
import { linearScale, logScale } from '@santiment-network/chart/scales'
import Chart from '../../Chart'
import { useChartColors } from '../../Chart/colors'
import { metricsToPlotCategories } from '../../Chart/Synchronizer'
import PaywallInfo from '../../Studio/Chart/PaywallInfo'
import ChartActiveMetrics from '../../Studio/Chart/ActiveMetrics'
import SocialDominanceToggle from './SocialDominanceToggle'
import ChartHeader from './Header'
import styles from './index.module.scss'

const Canvas = ({
  className,
  settings,
  options,
  setOptions,
  loadings,
  metrics,
  boundaries,
  ...props
}) => {
  const [FocusedMetric, setFocusedMetric] = useState()
  const MetricColor = useChartColors(metrics, FocusedMetric)
  const scale = options.isLogScale ? logScale : linearScale

  function onMetricHover (metric) {
    setFocusedMetric(metric)
  }

  function onMetricHoverEnd () {
    setFocusedMetric()
  }

  return (
    <div className={cx(styles.wrapper, className)}>
      <ChartHeader
        {...props}
        metrics={metrics}
        options={options}
        settings={settings}
        setOptions={setOptions}
        className={styles.top}
      />
      <div className={styles.bottom}>
        <div className={styles.metrics}>
          <ChartActiveMetrics
            className={styles.metric}
            MetricColor={MetricColor}
            activeMetrics={metrics}
            loadings={loadings}
            onMetricHover={onMetricHover}
            onMetricHoverEnd={onMetricHoverEnd}
          />
        </div>
        <PaywallInfo boundaries={boundaries} metrics={metrics} />
        <SocialDominanceToggle
          className={styles.dominance}
          options={options}
          setOptions={setOptions}
        />
      </div>
      <Chart
        {...options}
        {...settings}
        {...props}
        scale={scale}
        className={styles.chart}
        metrics={metrics}
        MetricColor={MetricColor}
        resizeDependencies={[]}
      />
    </div>
  )
}

export default ({ options, activeMetrics, ...rest }) => {
  const categories = metricsToPlotCategories(activeMetrics)

  return (
    <Canvas
      tooltipKey='social_volume_total'
      options={options}
      activeMetrics={activeMetrics}
      metrics={activeMetrics}
      {...categories}
      {...rest}
    />
  )
}