import React from 'react'
import InsightCard from '../../../../components/Insight/InsightCardWithMarketcap'
import WithLikesMutation from '../../../../components/Like/WithLikesMutation'
import ActivityRenderer from '../../../SonarFeed/ActivityRenderer'
import TrendingWordsSignalCard from '../../../../components/SignalCard/card/TrendingWordsSignalCard'
import styles from './FeedItemRenderer.module.scss'

const isTrendingWordsSignal = trigger => {
  if (!trigger.settings) {
    return false
  }

  if (trigger.settings.type === 'trending_words') {
    return true
  }

  return trigger.settings.operation && trigger.settings.operation.trending_word
}

const FeedItemRenderer = ({ item, index }) => {
  const { __typename, user: { id } = {} } = item

  if (__typename === 'SignalHistoricalActivity') {
    let isTrendingWords = isTrendingWordsSignal(item.trigger)

    return (
      <>
        {!isTrendingWords && (
          <ActivityRenderer activity={item} index={index} classes={styles} />
        )}
        {isTrendingWords && (
          <TrendingWordsSignalCard
            signal={item.trigger}
            date={item.triggeredAt}
            className={styles.card}
            activityPayload={item.payload.default}
            creatorId={id}
          />
        )}
      </>
    )
  } else if (__typename === 'TimelineEvent') {
    const { post } = item

    if (post) {
      const { id, ...rest } = post
      return (
        <WithLikesMutation>
          {mutateInsightById => (
            <InsightCard
              id={id}
              {...rest}
              className={styles.card}
              onLike={mutateInsightById}
            />
          )}
        </WithLikesMutation>
      )
    }
  }

  return null
}

export default FeedItemRenderer