import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import {
  WATCHLIST_GENERAL_FRAGMENT,
  SHORT_LIST_ITEMS_FRAGMENT
} from '../../WatchlistAddressesTable/gql/queries'

const ARRAY = []
export const newWatchlistsQuery = (
  type,
  generalFragment,
  listItemsFragment
) => gql`
  query fetchWatchlists {
    fetchWatchlists(type: ${type}) {
      ...generalFragment
      ...listItemsFragment
    }
  }
  ${generalFragment}
  ${listItemsFragment}
`

const ADDRESS_WATCHLISTS_QUERY = newWatchlistsQuery(
  'BLOCKCHAIN_ADDRESS',
  WATCHLIST_GENERAL_FRAGMENT,
  SHORT_LIST_ITEMS_FRAGMENT
)

function useWatchlists (query) {
  const { data, loading } = useQuery(query)
  return {
    watchlists: data ? data.fetchWatchlists : ARRAY,
    isLoading: loading
  }
}

export const useAddressWatchlists = () =>
  useWatchlists(ADDRESS_WATCHLISTS_QUERY)
