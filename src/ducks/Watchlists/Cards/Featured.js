import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import ProjectCard, { useMarketcap } from './ProjectCard'
import { WatchlistCards } from './Card'
import { useFeaturedWatchlists } from '../gql/queries'

const FEATURED_WATCHLISTS_MARKETCAP_HISTORY_QUERY = gql`
  query {
    featuredWatchlists {
      id
      historicalStats(from: "utc_now-7d", to: "utc_now", interval: "6h") {
        marketcap
      }
    }
  }
`

const marketcapAccessor = ({ featuredWatchlists }, { id }) =>
  console.log(featuredWatchlists) ||
  featuredWatchlists.find(watchlist => watchlist.id === id)

function useWatchlistMarketcap (watchlist, skip, onLoad) {
  const { data } = useQuery(FEATURED_WATCHLISTS_MARKETCAP_HISTORY_QUERY, {
    skip
  })

  return useMarketcap(data, watchlist, onLoad, marketcapAccessor)
}

const FeaturedWatchlists = ({ className, ...props }) => {
  const [watchlists] = useFeaturedWatchlists()

  return (
    <WatchlistCards
      Card={ProjectCard}
      {...props}
      className={className}
      watchlists={watchlists}
      path='/watchlist/projects/'
      useWatchlistMarketcap={useWatchlistMarketcap}
      isWithVisibility={false}
    />
  )
}

export default FeaturedWatchlists
