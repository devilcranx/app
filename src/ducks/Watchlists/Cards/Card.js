import React, { useMemo } from 'react'
import cx from 'classnames'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import emptyChartSvg from './emptyChart.svg'
import { getSEOLinkFromIdAndTitle } from '../../../utils/url'
import { calcPercentageChange } from '../../../utils/utils'
import { millify } from '../../../utils/formatting'
import MiniChart from '../../../components/MiniChart'
import PercentChanges from '../../../components/PercentChanges'
import NewLabel from '../../../components/NewLabel/NewLabel'
import { VisibilityIndicator } from '../../../components/VisibilityIndicator'
import styles from './Card.module.scss'

export const WATCHLIST_MARKETCAP_HISTORY_QUERY = gql`
  query watchlist($id: ID!) {
    watchlist(id: $id) {
      id
      historicalStats(from: "utc_now-7d", to: "utc_now", interval: "6h") {
        datetime
        marketcap
      }
    }
  }
`

const NULL_MARKETCAP = '$ 0'
const LOADING = {
  isLoading: true
}
const DEFAULT = {
  marketcap: NULL_MARKETCAP
}
const useMarketcap = (variables, skip, onLoad) => {
  const { data } = useQuery(WATCHLIST_MARKETCAP_HISTORY_QUERY, {
    variables,
    skip
  })

  return useMemo(
    () => {
      if (!data) return LOADING
      if (onLoad) onLoad()

      const { historicalStats } = data.watchlist
      const { length } = historicalStats

      if (length === 0) return DEFAULT

      const lastMarketcap = historicalStats[length - 1].marketcap
      const firstMarketcap = historicalStats[0].marketcap

      return {
        data: historicalStats,
        marketcap: `$ ${millify(lastMarketcap)}`,
        change: calcPercentageChange(firstMarketcap, lastMarketcap)
      }
    },
    [data]
  )
}

const WatchlistCard = ({
  className,
  watchlist,
  path,
  skipMarketcap,
  isSimplified,
  isWithNewCheck,
  isWithVisibility,
  onMarketcapLoad
}) => {
  const { id, name, insertedAt, isPublic, href } = watchlist
  const { data, marketcap, change } = useMarketcap(
    watchlist,
    skipMarketcap,
    onMarketcapLoad
  )
  const noMarketcap = marketcap === NULL_MARKETCAP
  const to = href || path + getSEOLinkFromIdAndTitle(id, name)

  if (isSimplified) {
    return (
      <Link to={to} className={cx(styles.wrapper, styles.simple, className)}>
        {name}
        <PercentChanges changes={change} />
      </Link>
    )
  }

  return (
    <Link to={to} className={cx(styles.wrapper, className)}>
      <div className={styles.header}>
        {isWithNewCheck && (
          <NewLabel date={insertedAt} className={styles.new} />
        )}
        {name}
        {isWithVisibility && (
          <VisibilityIndicator
            isPublic={isPublic}
            className={styles.visibility}
          />
        )}
      </div>
      <div className={styles.marketcap}>
        {marketcap}
        {noMarketcap ? (
          <img src={emptyChartSvg} alt='empty chart' />
        ) : (
          <MiniChart name='marketcap' data={data} change={change} width={90} />
        )}
      </div>
      <div className={styles.change}>
        {noMarketcap ? (
          'No assets'
        ) : (
          <>
            <PercentChanges changes={change} />
            &nbsp;&nbsp; total cap, 7d
          </>
        )}
      </div>
    </Link>
  )
}

WatchlistCard.defaultProps = {
  isWithNewCheck: true,
  isWithVisibility: true
}

export const WatchlistCards = ({ watchlists, Card, ...props }) =>
  watchlists.map(watchlist => (
    <Card {...props} key={watchlist.id} watchlist={watchlist} />
  ))

WatchlistCards.defaultProps = {
  Card: WatchlistCard
}

export default WatchlistCard
