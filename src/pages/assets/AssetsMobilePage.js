import React from 'react'
import cx from 'classnames'
import { AutoSizer, List } from 'react-virtualized'
import Label from '@santiment-network/ui/Label'
import GetAssets, { SORT_TYPES } from './GetAssets'
import { getTableTitle } from './utils'
import { addRecentWatchlists, removeRecentWatchlists } from '../../utils/recent'
import AssetCard from './AssetCard'
import AssetsTemplates from './AssetsTemplates'
import WatchlistActions from './WatchlistActions'
import PageLoader from '../../components/Loader/PageLoader'
import MobileHeader from './../../components/MobileHeader/MobileHeader'
import styles from './AssetsMobilePage.module.scss'

const AssetsMobilePage = props => {
  const { isLoggedIn } = props
  const isList = props.type === 'list'
  return (
    <div className={cx('page', styles.wrapper)}>
      <GetAssets
        {...props}
        sortBy={SORT_TYPES.marketcap}
        type={props.type}
        render={({
          typeInfo: { listId },
          isLoading,
          isCurrentUserTheAuthor,
          isPublicWatchlist,
          items
        }) => {
          const title = getTableTitle(props)

          if (items.length && (isCurrentUserTheAuthor || isPublicWatchlist)) {
            addRecentWatchlists(listId)
          } else {
            // NOTE(vanguard): it's needed because when visiting empty/private watchlist all props stays the same for some time
            // but listId is changed immediatly which leads to adding listId to recents
            removeRecentWatchlists(listId)
          }

          return isLoading ? (
            <>
              <MobileHeader title={title} backRoute='/assets' />
              <PageLoader />
            </>
          ) : (
            <>
              <MobileHeader
                title={title}
                backRoute='/assets'
                rightActions={
                  <WatchlistActions
                    isLoggedIn={isLoggedIn}
                    isDesktop={false}
                    isList={isList}
                    listType={props.location.hash}
                    shareLink={window.location.href + '#shared'}
                    isAuthor={isCurrentUserTheAuthor}
                    id={listId}
                    title={title}
                    items={items}
                    type={props.type}
                    location={props.location}
                  />
                }
              />
              {items.length > 0 && (
                <>
                  <div className={styles.headings}>
                    <Label accent='casper'>Coin</Label>
                    <Label accent='casper'>Price, 24h</Label>
                  </div>
                  <AssetsList items={items} />
                </>
              )}

              <AssetsTemplates
                items={items}
                isAuthor={isCurrentUserTheAuthor}
                isPublic={isPublicWatchlist}
                listId={listId}
                title={title}
              />
            </>
          )
        }}
      />
    </div>
  )
}

const ROW_HEIGHT = 71

export const AssetsList = ({ items, renderer, rowHeight = ROW_HEIGHT }) => {
  const rowRenderer =
    renderer ||
    function ({ key, index, style }) {
      const asset = items[index]
      return (
        <div key={key} style={style}>
          <AssetCard {...asset} />
        </div>
      )
    }

  return (
    <div className={styles.wrapperList}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowHeight={rowHeight}
            rowCount={items.length}
            overscanRowCount={5}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  )
}

export default AssetsMobilePage
