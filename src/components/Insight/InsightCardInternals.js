import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { Icon } from '@santiment-network/ui'
import InsightTags from './InsightTags'
import ProfileInfo from './ProfileInfo'
import MultilineText from '../MultilineText/MultilineText'
import LikeBtn from '../Like/LikeBtn'
import { getSEOLinkFromIdAndTitle } from './utils'
import { DesktopOnly } from '../Responsive'
import { SignalTypeIcon } from '../SignalCard/controls/SignalControls'
import styles from './InsightCard.module.scss'

export const makeLinkToInsight = (id, title) => {
  return `https://insights.santiment.net/read/${getSEOLinkFromIdAndTitle(
    id,
    title
  )}`
}

const InsightCardInternals = ({
  id,
  state,
  user: { id: authorId, username: authorName, avatarUrl },
  title,
  createdAt,
  publishedAt,
  tags,
  votes: { totalVotes },
  commentsCount,
  votedAt,
  onLike,
  withAuthorPic,
  disabled,
  isDesktop,
  showIcon = false,
  showDate = false,
  children
}) => {
  const linkToInsight = makeLinkToInsight(id, title)

  return (
    <div className={styles.container}>
      {showIcon && (
        <DesktopOnly>
          <SignalTypeIcon type={'social'} />
        </DesktopOnly>
      )}
      <div className={cx(styles.main, showIcon && styles.withIcon)}>
        <div className={styles.description}>
          <div className={styles.top}>
            <a href={linkToInsight} className={styles.title}>
              <MultilineText maxLines={2} id='insightCardTitle' text={title} />
            </a>
            <div className={styles.profile}>
              <ProfileInfo
                withPic={withAuthorPic}
                picUrl={avatarUrl}
                date={publishedAt || createdAt}
                state={state}
                name={
                  <Link className={styles.name} to={`/profile/${authorId}`}>
                    {authorName}
                  </Link>
                }
                showDate={showDate}
                infoClassName={styles.info}
              />
            </div>
          </div>
          <div className={styles.chart}>{children}</div>
        </div>
        <div className={styles.bottom}>
          <LikeBtn
            likesNumber={totalVotes}
            liked={!!votedAt}
            onClick={onLike}
            disabled={disabled}
            className={styles.likeBtn}
          />
          <a
            href={linkToInsight + '?_wc=1#comments'}
            className={cx(styles.stat, styles.stat_comments)}
          >
            <Icon type='comment' className={styles.commentIcon} />{' '}
            {commentsCount}
          </a>
          <div className={styles.tags}>
            <InsightTags tags={tags} isDesktop={isDesktop} />
          </div>
        </div>
      </div>
    </div>
  )
}

InsightCardInternals.defaultProps = {
  votes: {},
  tags: [],
  commentsCount: 0,
  withAuthorPic: true
}

export default InsightCardInternals
