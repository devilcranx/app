import React, { useMemo, useState } from 'react'
import { QueuedDashboardMetricChart as DashboardMetricChart } from '../../../components/DashboardMetricChart/DashboardMetricChart'
import { DEX_INTERVAL_SELECTORS } from '../../../components/DashboardMetricChart/utils'
import { useDexMeasurement } from '../PriceMeasurement/DexPriceMeasurement'

export const DEXs = [
  'UniswapV2',
  'Sushiswap',
  'Balancer',
  'dYdX',
  '0x_v2',
  'Curve',
  '0x_v3',
  'KyberNetwork',
  'Uniswap',
  'Etherdelta',
  'Bancor',
  'Airswap',
  'Gnosis',
  'OasisDEX',
  'IDEX',
  'DDEX',
  '0x_v1',
  'TokenStore',
  'DEX.Top',
  'Synthetix'
]

const NumberOfTradesPerDex = ({ metrics, measurement: strictMeasurement }) => {
  const { measurement, setMeasurement } = useDexMeasurement(strictMeasurement)
  const [rootMetric, setRootMetric] = useState(metrics[0])

  const dexMetrics = useMemo(
    () => {
      const measurementSlug = measurement.slug.replace(/-/g, '_')
      return DEXs.map(dex => {
        return {
          key: `${rootMetric.key}_${measurementSlug}_${dex.replace('.', '_')}`,
          queryKey: rootMetric.key,
          node: 'bar',
          label: dex,
          fill: true,
          domainGroup: 'decentralized_exchanges',
          reqMeta: {
            owner: dex,
            slug: measurement.slug
          }
        }
      })
    },
    [rootMetric, measurement]
  )

  return (
    <DashboardMetricChart
      metrics={dexMetrics}
      metricSelectors={metrics}
      setRootMetric={setRootMetric}
      rootMetric={rootMetric}
      intervals={DEX_INTERVAL_SELECTORS}
      setMeasurement={strictMeasurement ? null : setMeasurement}
      measurement={measurement}
    />
  )
}

export default NumberOfTradesPerDex
