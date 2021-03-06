import { formatNumber } from '../../utils/formatting'
import { CRYPTO_ERA_START_DATE, DEX_ERA_START_DATE } from '../../utils/dates'
import { formIntervalSettings } from '../../ducks/SANCharts/IntervalSelector'

export const makeIntervalSelectors = ({
  val,
  label,
  interval = '1d',
  from
}) => {
  const requestParams = {
    ...formIntervalSettings(val),
    interval
  }

  if (from) {
    requestParams.from = from
  }

  return {
    value: val,
    label: label,
    requestParams
  }
}

export const makeMetric = (key, label, formatter = formatNumber) => {
  return {
    key,
    label,
    formatter
  }
}

export const INTERVAL_30_DAYS = makeIntervalSelectors({
  val: '30d',
  label: '1M',
  interval: '3h'
})

export const INTERVAL_6_MONTHS = makeIntervalSelectors({
  val: '183d',
  label: '6M',
  interval: '1d'
})

export const INTERVAL_3_MONTHS = makeIntervalSelectors({
  val: '90d',
  label: '3M',
  interval: '8h'
})

const INTERVAL_DAY = makeIntervalSelectors({
  val: '1d',
  label: '1D',
  interval: '15m'
})

export const NON_DAILY_INTERVAL_SELECTORS = [
  makeIntervalSelectors({ val: '1w', label: '1W', interval: '1h' }),
  INTERVAL_30_DAYS,
  INTERVAL_3_MONTHS,
  INTERVAL_6_MONTHS,
  makeIntervalSelectors({ val: '1y', label: '1Y', interval: '1d' }),
  makeIntervalSelectors({
    val: 'all',
    label: 'All',
    interval: '1d',
    from: CRYPTO_ERA_START_DATE
  })
]

export const ETH2_INTERVAL_SELECTORS = [
  INTERVAL_DAY,
  makeIntervalSelectors({ val: '1w', label: '1W', interval: '1h' }),
  INTERVAL_30_DAYS,
  INTERVAL_3_MONTHS,
  INTERVAL_6_MONTHS,
  makeIntervalSelectors({ val: '1y', label: '1Y', interval: '1d' })
]

export const DEFAULT_INTERVAL_SELECTORS = [
  INTERVAL_DAY,
  ...NON_DAILY_INTERVAL_SELECTORS
]

export const DEX_INTERVAL_SELECTORS = [
  INTERVAL_DAY,
  makeIntervalSelectors({ val: '1w', label: '1W', interval: '1h' }),
  INTERVAL_30_DAYS,
  makeIntervalSelectors({ val: '90d', label: '3M', interval: '8h' }),
  makeIntervalSelectors({ val: '183d', label: '6m', interval: '1d' }),
  makeIntervalSelectors({ val: '1y', label: '1Y', interval: '1d' }),
  makeIntervalSelectors({
    val: 'all',
    label: 'All',
    interval: '1d',
    from: DEX_ERA_START_DATE
  })
]
