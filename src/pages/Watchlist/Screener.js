import React, { useCallback, useState } from 'react'
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
import { ProjectsMapWrapper } from '../../ducks/Watchlists/Widgets/VolumeChart/ProjectsTreeMap'
import ProjectsChart from '../../ducks/Watchlists/Widgets/VolumeChart/ProjectsChart'
import {
  PRICE_CHANGE_RANGES,
  SOCIAL_VOLUME_CHANGE_RANGES
} from '../../ducks/Watchlists/Widgets/VolumeChart/utils'
import { addOrRemove } from '../../ducks/Watchlists/Widgets/Table/CompareDialog/CompareDialog'
import { useUserSubscriptionStatus } from '../../stores/user/subscriptions'
import MakeProSubscriptionCard from '../feed/GeneralFeed/MakeProSubscriptionCard/MakeProSubscriptionCard'
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
  const [widgetsState, setWidgetsState] = useState({
    isPriceChartActive: false,
    isPriceTreeMap: false,
    isVolumeTreeMap: false
  })

  const { isPriceChartActive, isPriceTreeMap, isVolumeTreeMap } = widgetsState

  const [screenerFunction, setScreenerFunction] = useState(
    props.watchlist.function || DEFAULT_SCREENER_FUNCTION
  )
  const [assets = [], loading] = getProjectsByFunction(screenerFunction)

  const {
    watchlist,
    name,
    isLoggedIn,
    isDefaultScreener,
    location,
    history,
    preload,
    type
  } = props

  useScreenerUrl({ location, history, widgets: widgetsState, setWidgetsState })

  const { comparingAssets, addAsset, cleanAll } = useComparingAssets()

  const { isPro } = useUserSubscriptionStatus()

  return (
    <div className={('page', styles.screener)}>
      <GetAssets
        {...props}
        type={type}
        render={Assets => {
          const title = getWatchlistName(props)
          const {
            typeInfo: { listId },
            isCurrentUserTheAuthor
          } = Assets

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
                widgets={widgetsState}
                updateWidgetsState={setWidgetsState}
              />
              {isPriceTreeMap && (
                <div className={styles.treeMaps}>
                  <ProjectsMapWrapper
                    className={styles.containerTreeMap}
                    assets={assets}
                    title='Price Changes'
                    ranges={PRICE_CHANGE_RANGES}
                    loading={loading}
                  />
                </div>
              )}
              {isVolumeTreeMap && (
                <div className={styles.treeMaps}>
                  {isPro ? (
                    <ProjectsMapWrapper
                      className={styles.containerTreeMap}
                      assets={assets}
                      title='Social Volume Changes'
                      ranges={SOCIAL_VOLUME_CHANGE_RANGES}
                      loading={loading}
                      isSocialVolume={true}
                      defaultSelectedIndex={0}
                    />
                  ) : (
                    <MakeProSubscriptionCard />
                  )}
                </div>
              )}
              {isPriceChartActive && (
                <ProjectsChart loading={loading} assets={assets} />
              )}
              <AssetsTable
                Assets={{ ...Assets, isLoading: loading }}
                items={assets}
                type='screener'
                isAuthor={isCurrentUserTheAuthor}
                watchlist={watchlist}
                classes={{ container: styles.tableWrapper, top: styles.top }}
                className={styles.table}
                goto={history.push}
                history={history}
                preload={preload}
                listName={title}
                allColumns={ASSETS_TABLE_COLUMNS}
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
