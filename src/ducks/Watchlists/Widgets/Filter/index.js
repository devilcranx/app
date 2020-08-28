import React, { useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import Search from '@santiment-network/ui/Search'
import Message from '@santiment-network/ui/Message'
import Loader from '@santiment-network/ui/Loader/Loader'
import { store } from '../../../../redux'
import { showNotification } from '../../../../actions/rootActions'
import { useUpdateWatchlist } from '../../gql/hooks'
import Trigger from './Trigger'
import { metrics } from './dataHub/metrics'
import Category from './Category'
import ToggleActiveFilters from './ToggleActiveFilters'
import { DEFAULT_SCREENER_FUNCTION } from '../../utils'
import { getCategoryGraph } from '../../../Studio/Sidebar/utils'
import { countCategoryActiveMetrics } from '../../../SANCharts/ChartMetricSelector'
import { getActiveBaseMetrics, getNewFunction, extractFilters } from './utils'
import { isContainMetric } from './detector'
import { useAvailableMetrics } from '../../gql/hooks'
import { useUserSubscriptionStatus } from '../../../../stores/user/subscriptions'
import { APP_STATES } from '../../../Updates/reducers'
import styles from './index.module.scss'

const VIEWPORT_HEIGHT = window.innerHeight

const Filter = ({
  watchlist = {},
  projectsCount,
  isAuthor,
  screenerFunction,
  setScreenerFunction,
  isLoggedIn,
  isDefaultScreener,
  history,
  appVersionState
}) => {
  if (!screenerFunction) {
    return null
  }

  const isViewMode = !isAuthor && (isLoggedIn || !isDefaultScreener)
  const filters = extractFilters(screenerFunction.args)

  const filterRef = useRef(null)
  const filterContentRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, updateFilter] = useState(filters)
  const [isOutdatedVersion, setIsOutdatedVersion] = useState(false)
  const [isActiveFiltersOnly, setIsActiveFiltersOnly] = useState(false)
  const [isWereChanges, setIsWereChanges] = useState(false)
  const [updateWatchlist, { loading }] = useUpdateWatchlist()
  const [availableMetrics] = useAvailableMetrics()
  const [isReset, setIsReset] = useState(false)
  const { isPro } = useUserSubscriptionStatus()

  const isNoFilters =
    filters.length === 0 || screenerFunction.name === 'top_all_projects'

  useEffect(() => {
    const sidebar = filterRef.current
    const sidebarContent = filterContentRef.current
    const tableHeader = document.querySelector('#tableTop')
    const table = document.querySelector('#table')

    if (!tableHeader) {
      return
    }

    function changeFilterHeight () {
      requestAnimationFrame(() => {
        const { bottom, top } = tableHeader.getBoundingClientRect()
        const { bottom: bottomTable } = table.getBoundingClientRect()

        if (!sidebar) {
          return
        }

        if (top > 0) {
          sidebarContent.style.height = `${VIEWPORT_HEIGHT - bottom - 34}px`
          sidebar.classList.remove(styles.fixed)
        } else if (bottomTable > VIEWPORT_HEIGHT) {
          sidebar.classList.add(styles.fixed)
        }
      })
    }

    changeFilterHeight()

    window.addEventListener('scroll', changeFilterHeight)
    return () => window.removeEventListener('scroll', changeFilterHeight)
  }, [])

  useEffect(
    () => {
      if (isOutdatedVersion && appVersionState !== APP_STATES.LATEST) {
        store.dispatch(
          showNotification({
            variant: 'warning',
            title: `Some filters don't present in your app version`,
            description: "Please, update version by 'CTRL/CMD + SHIFT+ R'",
            dismissAfter: 8000000,
            actions: [
              {
                label: 'Update now',
                onClick: () => window.location.reload(true)
              }
            ]
          })
        )
      }
    },
    [isOutdatedVersion]
  )

  function resetAll () {
    const func = DEFAULT_SCREENER_FUNCTION
    updateFilter([])

    if (watchlist.id && !isNoFilters) {
      updateWatchlist(watchlist, { function: func })
    }
    setScreenerFunction(func)
    setIsReset(true)
  }

  function updMetricInFilter (metric, key, alternativeKey = key) {
    if (isViewMode) {
      return
    }

    const filters = isNoFilters
      ? []
      : filter.filter(
        item =>
          !isContainMetric(item.args.metric || item.name, key) &&
            !isContainMetric(item.args.metric || item.name, alternativeKey)
      )
    const newFilter = [...filters, metric]

    const newFunction = getNewFunction(newFilter)
    updateFilter(newFilter)

    if (watchlist.id) {
      updateWatchlist(watchlist, { function: newFunction })
    }
    setScreenerFunction(newFunction)

    if (newFilter.length > 0 && isReset) {
      setIsReset(false)
    }

    if (!isWereChanges) {
      setIsWereChanges(true)
    }
  }

  function toggleMetricInFilter (metric, key, alternativeKey = key) {
    if (isViewMode) {
      return
    }

    const isMetricInList = filter.some(
      item =>
        isContainMetric(item.args.metric || item.name, key) ||
        isContainMetric(item.args.metric || item.name, alternativeKey)
    )
    let newFilter = []
    if (isMetricInList) {
      newFilter = filter.filter(
        item =>
          !isContainMetric(item.args.metric || item.name, key) &&
          !isContainMetric(item.args.metric || item.name, alternativeKey)
      )
    } else {
      newFilter = [...filter, metric]
    }

    const newFunction = getNewFunction(newFilter)

    updateFilter(newFilter)

    if (watchlist.id) {
      updateWatchlist(watchlist, { function: newFunction })
    }
    setScreenerFunction(newFunction)

    if (newFilter.length > 0 && isReset) {
      setIsReset(false)
    }

    if (!isWereChanges) {
      setIsWereChanges(true)
    }
  }

  const categories = getCategoryGraph(metrics)
  const activeBaseMetrics = getActiveBaseMetrics(filter)
  activeBaseMetrics.forEach(metric => {
    if (metric === undefined && !isOutdatedVersion) {
      setIsOutdatedVersion(true)
    }
  })
  const categoryActiveMetricsCounter = countCategoryActiveMetrics(
    activeBaseMetrics
  )

  return (
    <>
      <Trigger
        isOpen={isOpen}
        onClick={newIsOpenState => {
          setIsOpen(newIsOpenState)

          if (!isLoggedIn && newIsOpenState && !isViewMode) {
            store.dispatch(
              showNotification({
                variant: 'warning',
                title: `Log in to save your filter settings`,
                description:
                  "Your settings will be lost after refresh if you're not logged in to Sanbase",
                dismissAfter: 8000,
                actions: [
                  {
                    label: 'Log in',
                    onClick: () => history.push('/login')
                  },
                  {
                    label: 'Create an account',
                    onClick: () => history.push('/sign-up')
                  }
                ]
              })
            )
          }
        }}
        activeMetricsCount={activeBaseMetrics.length}
      />
      <section
        className={cx(styles.wrapper, isOpen && styles.active)}
        ref={filterRef}
      >
        <Icon
          type='close-medium'
          className={styles.closeIcon}
          onClick={() => setIsOpen(false)}
        />
        <div className={styles.top}>
          <div>
            <span className={styles.count__assets}>{projectsCount} assets</span>
            {!loading && (
              <span className={styles.count__filters}>{`${
                activeBaseMetrics.length
              } filter${
                activeBaseMetrics.length !== 1 ? 's' : ''
              } activated`}</span>
            )}
            {loading && <Loader className={styles.loader} />}
          </div>
          {!isViewMode && (
            <Search className={styles.search} placeholder='Search metrics' />
          )}
          <div className={styles.togglers}>
            <ToggleActiveFilters
              isActive={isActiveFiltersOnly}
              onClick={() => setIsActiveFiltersOnly(!isActiveFiltersOnly)}
            />
            {!isViewMode && (
              <Button
                className={styles.button}
                onClick={resetAll}
                disabled={isReset || (!isWereChanges && isNoFilters)}
              >
                Reset all
              </Button>
            )}
          </div>
          {isViewMode && (
            <Message
              variant='warn'
              icon='info-round'
              className={styles.message}
            >
              View only. You aren't the author of this screener
            </Message>
          )}
        </div>
        <div className={styles.content} ref={filterContentRef}>
          {isOpen &&
            Object.keys(categories).map(key => (
              <Category
                key={key}
                title={key}
                counter={categoryActiveMetricsCounter[key]}
                groups={categories[key]}
                toggleMetricInFilter={toggleMetricInFilter}
                availableMetrics={availableMetrics}
                isViewMode={isViewMode}
                isNoFilters={isReset}
                filters={filter}
                updMetricInFilter={updMetricInFilter}
                isPro={isPro}
              />
            ))}
        </div>
      </section>
    </>
  )
}

const mapStateToProps = ({ app }) => ({
  appVersionState: app.appVersionState
})

export default connect(mapStateToProps)(Filter)
