import React from 'react'
import Section from './Section'
import Page from '../../ducks/Page'
import { useUser } from '../../stores/user'
import { DesktopOnly, MobileOnly } from '../../components/Responsive'
import StoriesList from '../../components/Stories/StoriesList'
import RecentlyWatched from '../../components/RecentlyWatched/RecentlyWatched'
import WatchlistCard from '../../ducks/Watchlists/Cards/ProjectCard'
import WatchlistAddressCard from '../../ducks/Watchlists/Cards/AddressCard'
import { WatchlistCards } from '../../ducks/Watchlists/Cards/Card'
import FeaturedWatchlistCards from '../../ducks/Watchlists/Cards/Featured'
import { WatchlistEmptySection } from '../../ducks/Watchlists/Cards/MyWatchlist'
import {
  useAddressWatchlists,
  useUserWatchlists,
  useUserScreeners
} from '../../ducks/Watchlists/gql/queries'
import NewWatchlistCard from '../../ducks/Watchlists/Cards/NewCard'
import {
  newRenderQueue,
  withRenderQueueProvider,
  useRenderQueueItem
} from '../../ducks/renderQueue/sized'
import MobileAnonBanner from '../../ducks/Watchlists/Templates/Anon/WatchlistsAnon'
import InlineBanner from '../../components/banners/feature/InlineBanner'
import { createWatchlist as createAddressesWatchlist } from '../../ducks/HistoricalBalance/Address/AddToWatchlist'
import styles from './index.module.scss'

const LoginBanner = ({ isDesktop }) =>
  isDesktop ? (
    <InlineBanner
      title='Get ability to create your own watchlist when you login'
      description="Track selected assets in one place and check it's status"
    />
  ) : (
    <MobileAnonBanner isFullScreen wrapperClassName={styles.login} />
  )

const QueuedProjectCard = props => {
  const { isRendered, onLoad } = useRenderQueueItem()

  return (
    <WatchlistCard
      {...props}
      skipMarketcap={!isRendered}
      onMarketcapLoad={onLoad}
    />
  )
}

const Cards = ({
  type,
  watchlists,
  Card = QueuedProjectCard,
  createWatchlist
}) => (
  <>
    <WatchlistCards
      className={styles.card}
      Card={Card}
      watchlists={watchlists}
    />

    <DesktopOnly>
      <NewWatchlistCard type={type} createWatchlist={createWatchlist} />
    </DesktopOnly>
  </>
)

const MyWatchlists = ({ data, Card, createWatchlist }) => {
  const [watchlists, isLoading] = data
  if (isLoading) return null

  if (watchlists.length === 0) {
    return (
      <WatchlistEmptySection
        wrapperClassName={styles.empty}
        className={styles.empty__img}
      />
    )
  }

  return (
    <Cards
      Card={Card}
      watchlists={watchlists}
      createWatchlist={createWatchlist}
    />
  )
}

const MyScreeners = ({ Card }) => {
  const [watchlists, isLoading] = useUserScreeners()
  if (isLoading) return null

  return <Cards watchlists={watchlists} path='/screener/' type='screener' />
}

const Watchlists = ({ isDesktop }) => {
  const { isLoggedIn, loading } = useUser()
  const userWatchlistsData = useUserWatchlists()
  const userAddressesWatchlistsData = useAddressWatchlists()
  console.log(userAddressesWatchlistsData)

  return (
    <Page
      className={styles.wrapper}
      title={isDesktop ? null : 'Watchlists'}
      isCentered
      isWithPadding={!isDesktop}
    >
      <MobileOnly>
        <StoriesList classes={styles} />
        <RecentlyWatched type='watchlists' />
      </MobileOnly>

      <DesktopOnly>
        <Section isGrid title='Explore watchlists'>
          <FeaturedWatchlistCards Card={QueuedProjectCard} />
        </Section>
      </DesktopOnly>

      <Section
        isGrid={isDesktop && isLoggedIn && userWatchlistsData[0].length > 0}
        title='My watchlists'
      >
        {isLoggedIn ? (
          <MyWatchlists data={userWatchlistsData} />
        ) : (
          loading || <LoginBanner isDesktop={isDesktop} />
        )}
      </Section>

      <Section
        isGrid={isDesktop && isLoggedIn && userWatchlistsData[0].length > 0}
        title='My addresses watchlists'
      >
        {isLoggedIn ? (
          <MyWatchlists
            createWatchlist={createAddressesWatchlist}
            Card={WatchlistAddressCard}
            data={[
              userAddressesWatchlistsData.watchlists,
              userAddressesWatchlistsData.isLoading
            ]}
          />
        ) : (
          loading || <LoginBanner isDesktop={isDesktop} />
        )}
      </Section>

      <Section isGrid={isDesktop} title='My screeners'>
        <MyScreeners />
      </Section>
    </Page>
  )
}

export default withRenderQueueProvider(Watchlists, newRenderQueue(4))
