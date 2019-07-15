import React, { Fragment, useState, useEffect } from 'react'
import { matchPath } from 'react-router'
import { connect } from 'react-redux'
import { Link, Route, Redirect, Switch } from 'react-router-dom'
import Icon from '@santiment-network/ui/Icon'
import Tabs from '@santiment-network/ui/Tabs'
import Loadable from 'react-loadable'
import PageLoader from '../../components/Loader/PageLoader'
import SignalMasterModalForm from '../../ducks/Signals/signalModal/SignalMasterModalForm'
import InsightUnAuthPage from './../../pages/Insights/InsightUnAuthPage'
import MobileHeader from '../../components/MobileHeader/MobileHeader'
import { selectIsTelegramConnected } from '../../pages/UserSelectors'
import { showNotification } from '../../actions/rootActions'
import styles from './SonarFeedPage.module.scss'

const baseLocation = '/sonar/feed'
const editTriggerSettingsModalLocation = `${baseLocation}/details/:id/edit`
const aboutTriggerModalLocation = `${baseLocation}/details/:id/about`

const tabs = [
  {
    index: `${baseLocation}/activity`,
    content: 'Activity',
    component: Loadable({
      loader: () => import('./SonarFeedActivityPage'),
      loading: () => <PageLoader />
    })
  },
  // {
  // index: `${baseLocation}/explore`,
  // content: 'Explore',
  // component: Loadable({
  // loader: () => import('../../components/SignalCard/SignalCardsGrid'),
  // loading: () => <PageLoader />
  // })
  // },
  {
    index: `${baseLocation}/my-signals`,
    content: 'My signals',
    component: Loadable({
      loader: () => import('./SonarFeedMySignalsPage'),
      loading: () => <PageLoader />
    })
  }
]

const LoadableSignalDetailsPage = Loadable({
  loader: () => import('./SignalDetails'),
  loading: () => <PageLoader />
})

const LoadableEditSignalPage = Loadable({
  loader: () => import('./SonarFeedMySignalsPage'),
  loading: () => <PageLoader />
})

const SonarFeed = ({
  location: { pathname },
  isLoggedIn,
  isDesktop,
  isTelegramConnected,
  showTelegramAlert
}) => {
  if (pathname === baseLocation) {
    return <Redirect exact from={baseLocation} to={tabs[0].index} />
  }

  useEffect(
    () => {
      if (!isTelegramConnected && isLoggedIn) {
        showTelegramAlert()
      }
    },
    [isTelegramConnected, isLoggedIn]
  )

  const [triggerId, setTriggerId] = useState(undefined)
  const [step, setTriggerStep] = useState(undefined)

  const setLoadingSignalId = (id, step) => {
    setTriggerId(id)
    setTriggerStep(step)
  }

  useEffect(() => {
    const isAboutPath = matchPath(pathname, aboutTriggerModalLocation)
    if (
      triggerId &&
      !matchPath(pathname, editTriggerSettingsModalLocation) &&
      !isAboutPath
    ) {
      setTriggerId(undefined)
    }

    if (triggerId && !isAboutPath) {
      setTriggerStep(undefined)
    }
  })

  return (
    <div style={{ width: '100%' }} className='page'>
      {isDesktop ? (
        <div className={styles.header}>
          <h1>Sonar</h1>
          <div>
            {// TODO: Disable search and filter buttons
              false && pathname !== '/sonar/feed/activity' && (
                <Fragment>
                  <Icon type='search' className={styles.search} />
                  <Icon type='filter' className={styles.filter} />
                </Fragment>
              )}
            <SignalMasterModalForm triggerId={triggerId} step={step} />
          </div>
        </div>
      ) : (
        <div className={styles.header}>
          <MobileHeader
            title='Sonar'
            rightActions={
              <div className={styles.addSignal}>
                <SignalMasterModalForm triggerId={triggerId} step={step} />
              </div>
            }
          />
        </div>
      )}

      <Tabs
        options={tabs}
        defaultSelectedIndex={pathname}
        passSelectionIndexToItem
        className={styles.tabs}
        as={({ selectionIndex, ...props }) => (
          <Link {...props} to={selectionIndex} />
        )}
      />
      <div className={styles.content}>
        <Switch>
          {!isLoggedIn ? <InsightUnAuthPage /> : ''}
          {tabs.map(({ index, component }) => (
            <Route key={index} path={index} component={component} />
          ))}
          <Route
            path={`${baseLocation}/details/:id`}
            exact
            render={props => <LoadableSignalDetailsPage {...props} />}
          />
          ,
          <Route
            path={editTriggerSettingsModalLocation}
            exact
            render={props => (
              <LoadableEditSignalPage
                setLoadingSignalId={setLoadingSignalId}
                step={0}
                {...props}
              />
            )}
          />
          ,
          <Route
            path={aboutTriggerModalLocation}
            exact
            render={props => (
              <LoadableEditSignalPage
                setLoadingSignalId={setLoadingSignalId}
                step={1}
                {...props}
              />
            )}
          />
          }
        </Switch>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isTelegramConnected: selectIsTelegramConnected(state)
  }
}

const mapDispatchToProps = dispatch => ({
  showTelegramAlert: () => {
    dispatch(
      showNotification({
        variant: 'error',
        title: `Telegram is not connect`,
        description: (
          <div>
            Connect in{' '}
            <Link className={styles.link} to='/account'>
              My Account
            </Link>
          </div>
        ),
        dismissAfter: 8000
      })
    )
  }
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SonarFeed)
