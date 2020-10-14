import React, { useState } from 'react'
import { STABLECOIN_MARKETCAP_USD_METRIC, StablecoinsMetrics } from './utils'
import { useStablecoinMetrics } from './hooks'
import DashboardMetricChart from '../../../components/DashboardMetricChart/DashboardMetricChart'
import { DEFAULT_INTERVAL_SELECTORS } from '../../../components/DashboardMetricChart/utils'

const StablecoinsMarketCap = () => {
  const [rootMetric, setRootMetric] = useState(STABLECOIN_MARKETCAP_USD_METRIC)
  const metrics = useStablecoinMetrics(rootMetric)

  return (
    <DashboardMetricChart
      intervals={DEFAULT_INTERVAL_SELECTORS}
      metrics={metrics}
      metricSelectors={StablecoinsMetrics}
      setRootMetric={setRootMetric}
      rootMetric={rootMetric}
    />
  )
}

export default StablecoinsMarketCap
