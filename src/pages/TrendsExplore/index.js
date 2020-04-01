import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { compose, withProps } from 'recompose'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import SocialTool from '../SocialTool'
import * as actions from '../../components/Trends/actions'
import TrendsExploreSearch from '../../components/Trends/Explore/TrendsExploreSearch'
import MobileHeader from '../../components/MobileHeader/MobileHeader'
import withDetectionAsset from '../../components/Trends/withDetectionAsset'
import Trends from '../../components/Trends/Trends'
import WordCloud from './../../components/WordCloud/WordCloud'
import { safeDecode } from '../../utils/utils'
import { addRecentTrends } from '../../utils/recent'
import styles from './index.module.scss'

const pageDescription =
  'Explore the social volume of ANY word (or phrase) on crypto social media, including 100s of Telegram groups, crypto subreddits, discord channels, trader chats and more.'

const TrendsExplore = ({
  word,
  history,
  detectedAsset,
  fetchAllTickersSlugs,
  fetchTrendSocialData,
  isDesktop,
  allAssets
}) => {
  if (allAssets.length === 0) {
    fetchAllTickersSlugs()
  }

  addRecentTrends(word)
  fetchTrendSocialData(word)

  const topic = safeDecode(word)
  const pageTitle = `Crypto Social Trends for ${topic} - Sanbase`

  return (
    <div className={cx('page', styles.wrapper)}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={pageDescription} />
      </Helmet>
      <div className={styles.layout}>
        <div className={styles.main}>
          {isDesktop && (
            <div className={styles.breadcrumbs}>
              <Link to='/labs/trends/' className={styles.link}>
                Emerging trends
              </Link>
              <Icon type='arrow-right' className={styles.arrow} />
              Social context
            </div>
          )}
          <div className={styles.search}>
            {isDesktop ? (
              <TrendsExploreSearch
                topic={topic}
                isDesktop={isDesktop}
                history={history}
                className={styles.search}
              />
            ) : (
              <MobileHeader
                goBack={history.goBack}
                backRoute={'/'}
                classes={{
                  wrapper: styles.wrapperHeader,
                  searchBtn: styles.fullSearchBtn
                }}
                title=''
              >
                <TrendsExploreSearch
                  className={styles.search}
                  topic={topic}
                  isDesktop={isDesktop}
                />
              </MobileHeader>
            )}
          </div>
          <SocialTool
            settings={{ slug: detectedAsset ? detectedAsset.slug : topic }}
            detectedAsset={detectedAsset}
          />
        </div>
        <div className={styles.sidebar}>
          <WordCloud className={styles.cloud} hideWord word={topic} />
          <Trends className={styles.trends} isCompactView />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  allAssets: state.hypedTrends.allAssets
})

const mapDispatchToProps = dispatch => ({
  fetchAllTickersSlugs: () => {
    dispatch({
      type: actions.TRENDS_HYPED_FETCH_TICKERS_SLUGS
    })
  },
  fetchTrendSocialData: payload => {
    dispatch({
      type: actions.TRENDS_HYPED_WORD_SELECTED,
      payload
    })
  }
})

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withProps(({ match = { params: {} }, ...rest }) => {
    return {
      word: match.params.word,
      ...rest
    }
  }),
  withDetectionAsset
)(TrendsExplore)