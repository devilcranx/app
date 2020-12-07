import React, { useCallback, useState, useEffect } from 'react'
import {
  getWatchlistName,
  DEFAULT_SCREENER_FUNCTION,
  useScreenerUrl
} from '../../ducks/Watchlists/utils'
import { getProjectsByFunction } from '../../ducks/Watchlists/gql/hooks'
import TopPanel from '../../ducks/Watchlists/Widgets/TopPanel'
import GetAssets from '../../ducks/Watchlists/Widgets/Table/GetAssets'
import AssetsTable from '../../ducks/Watchlists/Widgets/Table/AssetsTable'
import { ASSETS_TABLE_COLUMNS } from '../../ducks/Watchlists/Widgets/Table/columns'
import { addOrRemove } from '../../ducks/Watchlists/Widgets/Table/CompareDialog/CompareDialog'
import Infographics from './Infographics'
import { useAssetsAnomalyToggler } from './hooks/useAssetsAnomalyToggler'
import { addRecentScreeners } from '../../utils/recent'
import styles from './Screener.module.scss'

export const useComparingAssets = () => {
  const [comparingAssets, setComparingAssets] = useState([])
  const addAsset = useCallback(
    item => {
      setComparingAssets(
        addOrRemove(comparingAssets, item, ({ id }) => id === item.id)
      )
    },
    [comparingAssets, setComparingAssets]
  )

  const cleanAll = useCallback(
    () => {
      setComparingAssets([])
    },
    [setComparingAssets]
  )

  return {
    comparingAssets,
    addAsset,
    cleanAll
  }
}

const Screener = props => {
  const {
    watchlist,
    name,
    isLoggedIn,
    isDefaultScreener,
    location,
    history,
    preload,
    type,
    id
  } = props

  const [screenerFunction, setScreenerFunction] = useState(
    watchlist.function || DEFAULT_SCREENER_FUNCTION
  )
  const [assets = [], loading] = getProjectsByFunction(screenerFunction)
  const [currentItems, setCurrentItems] = useState([])

  useEffect(
    () => {
      if (watchlist.function !== screenerFunction) {
        if (
          !watchlist.function &&
          screenerFunction === DEFAULT_SCREENER_FUNCTION
        ) {
          return
        }

        setScreenerFunction(watchlist.function)
      }
    },
    [watchlist.function]
  )

  const { widgets, setWidgets } = useScreenerUrl({ location, history })

  const { comparingAssets, addAsset, cleanAll } = useComparingAssets()

  const {
    toggleAssetsFiltering,
    filteredItems,
    clearFilters,
    filterType
  } = useAssetsAnomalyToggler()

  return (
    <div className={('page', styles.screener)}>
      <GetAssets
        {...props}
        type={type}
        render={Assets => {
          const title = getWatchlistName(props)
          const {
            items,
            typeInfo: { listId },
            isCurrentUserTheAuthor,
            trendingAssets = []
          } = Assets

          if (items !== currentItems) {
            setCurrentItems(items)
            clearFilters()
          }

          if (listId) {
            addRecentScreeners(listId)
          }

          const showingAssets = filteredItems || assets

          return (
            <>
              <TopPanel
                name={(watchlist || {}).name || name}
                id={listId}
                assets={assets}
                loading={loading}
                watchlist={watchlist}
                isAuthor={isCurrentUserTheAuthor}
                isLoggedIn={isLoggedIn}
                screenerFunction={screenerFunction}
                setScreenerFunction={setScreenerFunction}
                isDefaultScreener={isDefaultScreener}
                history={history}
                widgets={widgets}
                setWidgets={setWidgets}
              />

              {!loading && (
                <Infographics
                  assets={showingAssets}
                  widgets={widgets}
                  setWidgets={setWidgets}
                  trendingAssets={trendingAssets}
                  listId={id}
                  toggleAssetsFiltering={toggleAssetsFiltering}
                  filterType={filterType}
                />
              )}

              <AssetsTable
                Assets={{ ...Assets, isLoading: loading }}
                items={showingAssets}
                type='screener'
                isAuthor={isCurrentUserTheAuthor}
                watchlist={watchlist}
                className={styles.table}
                goto={history.push}
                history={history}
                preload={preload}
                listName={title}
                allColumns={ASSETS_TABLE_COLUMNS}
                filterType={filterType}
                compareSettings={{
                  comparingAssets,
                  addAsset,
                  cleanAll
                }}
              />
            </>
          )
        }}
      />
    </div>
  )
}

export default Screener
