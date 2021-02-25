import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAddressWatchlist, useAddressWatchlistItems } from './hooks'
import Page from '../../ducks/Page'
import { getIdFromSEOLink } from '../../utils/url'
import WatchlistAddressesTable from '../../ducks/WatchlistAddressesTable'
import PageLoader from '../../components/Loader/PageLoader'
import Actions from '../../ducks/Watchlists/Widgets/TopPanel/Actions'
import { useIsAuthor } from '../../ducks/Watchlist/gql/common/hooks'
import styles from './index.module.scss'

const WatchlistAddress = ({ match }) => {
  const { watchlist, isLoading } = useAddressWatchlist(
    getIdFromSEOLink(match.params.nameId)
  )
  const { isAuthor, isAuthorLoading } = useIsAuthor(watchlist)
  const items = useAddressWatchlistItems(watchlist)

  if (isLoading) return <PageLoader />
  if (!watchlist.id) return <Redirect to='/' />

  return (
    <Page
      className={styles.wrapper}
      headerClassName={styles.header}
      isWithPadding={false}
      title={watchlist.name}
      actions={
        <Actions
          watchlist={watchlist}
          isAuthor={isAuthor}
          isAuthorLoading={isAuthorLoading}
        />
      }
    >
      <WatchlistAddressesTable
        items={items}
        watchlist={watchlist}
        isLoading={isLoading}
      />
    </Page>
  )
}

export default WatchlistAddress
