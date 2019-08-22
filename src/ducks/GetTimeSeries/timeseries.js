import { DEV_ACTIVITY_QUERY } from './queries/dev_activity_query'
import { HISTORY_PRICE_QUERY } from './queries/history_price_query'
import { ETH_SPENT_OVER_TIME_QUERY } from './queries/eth_spent_over_time_query'
import { BURN_RATE_QUERY } from './queries/burn_rate_query'
import { NVT_RATIO_QUERY } from './queries/nvt_ratio_query'
import { REALIZED_VALUE_QUERY } from './queries/realized_value_query'
import { HISTORY_TWITTER_DATA_QUERY } from './queries/history_twitter_data_query'
import { SOCIAL_VOLUME_QUERY } from './queries/social_volume_query'
import { DAILY_ACTIVE_ADDRESSES_QUERY } from './queries/daily_active_addresses_query'
import { EXCHANGE_FUNDS_FLOW_QUERY } from './queries/exchange_funds_flow_query'
import { TOKEN_AGE_CONSUMED_QUERY } from './queries/token_age_consumed_query'
import { MVRV_QUERY } from './queries/mvrv_query'
import { DAILY_ACTIVE_DEPOSITS_QUERY } from './queries/daily_active_deposits_query'
import { TOKEN_VELOCITY_QUERY } from './queries/token_velocity_query'
import { TOKEN_CIRCULATION_QUERY } from './queries/token_circulation_query'
import { NETWORK_GROWTH_QUERY } from './queries/network_growth_query'
import { SOCIAL_DOMINANCE_QUERY } from './queries/social_dominance_query'
import { PERCENT_OF_TOKEN_SUPPLY_ON_EXCHANGES } from './queries/percent_of_token_supply_on_exchanges_query'
import { TOP_HOLDERS_PERCENT_OF_TOTAL_SUPPLY } from './queries/top_holders_percent_of_total_supply'
import { GET_METRIC } from './queries/get_metric'
import { mergeTimeseriesByKey } from './../../utils/utils'

const TIMESERIES = {
  ethSpentOverTime: {
    query: ETH_SPENT_OVER_TIME_QUERY,
    preTransform: ({ ethSpentOverTime: { ethSpentOverTime } }) =>
      ethSpentOverTime
  },
  nvtRatioCirculation: {
    query: NVT_RATIO_QUERY,
    preTransform: ({ nvtRatio }) => nvtRatio
  },
  nvtRatioTxVolume: {
    query: NVT_RATIO_QUERY,
    preTransform: ({ nvtRatio }) => nvtRatio
  },
  burnRate: {
    query: BURN_RATE_QUERY
  },
  realizedValue: {
    query: REALIZED_VALUE_QUERY
  },
  historyTwitterData: {
    query: HISTORY_TWITTER_DATA_QUERY
  },
  historyPrice: {
    query: HISTORY_PRICE_QUERY
  },
  volume: {
    query: HISTORY_PRICE_QUERY,
    preTransform: ({ historyPrice }) => historyPrice
  },
  devActivity: {
    query: DEV_ACTIVITY_QUERY
  },
  socialDominance: {
    query: SOCIAL_DOMINANCE_QUERY
  },
  percentOfTokenSupplyOnExchanges: {
    query: PERCENT_OF_TOKEN_SUPPLY_ON_EXCHANGES,
    preTransform: ({ percentOnExchanges }) => percentOnExchanges
  },
  topHoldersPercentOfTotalSupply: {
    query: TOP_HOLDERS_PERCENT_OF_TOTAL_SUPPLY
  },
  tokenAgeConsumed: {
    query: TOKEN_AGE_CONSUMED_QUERY
  },
  exchangeFundsFlow: {
    query: EXCHANGE_FUNDS_FLOW_QUERY
  },
  dailyActiveAddresses: {
    query: DAILY_ACTIVE_ADDRESSES_QUERY
  },
  tokenCirculation: {
    query: TOKEN_CIRCULATION_QUERY
  },
  mvrvRatio: {
    query: MVRV_QUERY
  },
  dailyActiveDeposits: {
    query: DAILY_ACTIVE_DEPOSITS_QUERY
  },
  tokenVelocity: {
    query: TOKEN_VELOCITY_QUERY
  },
  transaction_volume: {
    query: GET_METRIC,
    preTransform: ({ getMetric: { timeseriesData } }) => {
      return timeseriesData
    }
  },
  networkGrowth: {
    query: NETWORK_GROWTH_QUERY
  },
  socialVolume: {
    query: SOCIAL_VOLUME_QUERY,
    title: 'Social Volume',
    preTransform: data =>
      mergeTimeseriesByKey({
        key: 'datetime',
        timeseries: Object.values(data),
        mergeData: (longestTSData, timeserieData) => {
          return {
            socialVolume:
              longestTSData.socialVolume + timeserieData.socialVolume,
            datetime: longestTSData.datetime
          }
        }
      })
  }
}

export const hasMetric = metric => !!TIMESERIES[metric]
export const getMetricQUERY = metric => {
  const { query } = TIMESERIES[metric]
  if (typeof query === 'function') {
    return query(metric)
  }
  return query
}
export const getPreTransform = metric => {
  const transform = TIMESERIES[metric].preTransform

  return ({ data, ...rest }) => ({
    ...rest,
    data: transform ? { [metric]: transform(data) } : data,
    __metric: metric
  })
}
