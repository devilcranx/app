import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@santiment-network/ui/Button'
import Loader from '@santiment-network/ui/Loader/Loader'
import WatchlistsAnon from '../../../ducks/Watchlists/Templates/Anon/WatchlistsAnon'
import EmptySection from './EmptySection'
import CreateWatchlistBtn from './CreateWatchlistBtn'
import {
  BLOCKCHAIN_ADDRESS,
  getWatchlistLink
} from '../../../ducks/Watchlists/utils'
import { VisibilityIndicator } from '../../VisibilityIndicator'
import { useUser } from '../../../stores/user'
import {
  useUserAddressWatchlists,
  useUserWatchlists
} from '../../../ducks/Watchlists/gql/queries'
import { getAddressesWatchlistLink } from '../../../ducks/Watchlists/url'
import { sortById } from '../../../utils/sortMethods'
import { getBlockMinHeight } from '../utils'
import styles from './WatchlistsDropdown.module.scss'

const WatchlistsDropdown = ({ activeLink }) => {
  const [projectsWatchlists, loading] = useUserWatchlists()
  const [addressesWatchlists, loadingAddresses] = useUserAddressWatchlists()
  const { loading: isLoggedInPending, isLoggedIn } = useUser()
  const isLoading = loading || loadingAddresses || isLoggedInPending

  if (isLoading) {
    return <Loader className={styles.loader} />
  }

  if (!isLoggedIn) {
    return <WatchlistsAnon className={styles.anon} />
  }

  const watchlists = addressesWatchlists
    .concat(projectsWatchlists)
    .sort(sortById)

  return watchlists.length === 0 ? (
    <EmptySection watchlists={watchlists} />
  ) : (
    <>
      <WatchlistList watchlists={watchlists} activeLink={activeLink} />
      <CreateWatchlistBtn
        watchlists={watchlists}
        className={styles.watchlistBtn}
      />
    </>
  )
}

const WatchlistList = ({ watchlists, activeLink }) => (
  <div
    className={styles.wrapper}
    style={{
      minHeight: getBlockMinHeight(watchlists),
      maxHeight: '100px'
    }}
  >
    <div className={styles.list}>
      {watchlists.map(watchlist => {
        const { name, id, isPublic, type } = watchlist
        const link =
          type === BLOCKCHAIN_ADDRESS
            ? getAddressesWatchlistLink(watchlist)
            : getWatchlistLink(watchlist)
        return (
          <Button
            fluid
            variant='ghost'
            key={id}
            as={Link}
            className={styles.item}
            to={link}
            isActive={activeLink === link}
          >
            <span className={styles.watchlistName}>{name}</span>
            <VisibilityIndicator isPublic={isPublic} />
          </Button>
        )
      })}
    </div>
  </div>
)

export default WatchlistsDropdown
