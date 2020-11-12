import { updateTooltipSetting } from '../dataHub/tooltipSettings'
import { getNewInterval, INTERVAL_ALIAS } from '../SANCharts/IntervalSelector'
import { usdFormatter } from '../dataHub/metrics/formatters'
import { normalizeQueryAlias } from '../Studio/Compare/utils'

export function getValidInterval (from, to) {
  const interval = getNewInterval(from, to)
  return INTERVAL_ALIAS[interval] || interval
}

const metricBuilder = slugToMetric => (asset, all, infrastructure) => {
  const metric = slugToMetric(asset, all, infrastructure)
  updateTooltipSetting(metric)
  return metric
}

export const walletMetricBuilder = metricBuilder(
  ({ slug }, allProjects, infrastructure) => {
    const found =
      !infrastructure &&
      allProjects.find(({ slug: targetSlug }) => targetSlug === slug)

    return {
      key: normalizeQueryAlias(slug),
      label: slug,
      node: 'line',
      queryKey: 'historicalBalance',
      reqMeta: {
        slug,
        infrastructure: infrastructure || found.infrastructure || 'ETH'
      }
    }
  }
)

export const priceMetricBuilder = metricBuilder(slug => ({
  key: `hb_price_usd_${normalizeQueryAlias(slug)}`,
  label: `Price of ${slug}`,
  node: 'area',
  queryKey: 'price_usd',
  formatter: usdFormatter,
  reqMeta: {
    slug
  }
}))
