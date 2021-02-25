import React from 'react'
import cx from 'classnames'
import Actions from '../Actions'
import Share from '../../../Actions/Share'
import Widgets from '../Widgets'
import Title from '../Title'
import WeeklyReport from '../../../Actions/WeeklyReport'
import { useIsAuthor } from '../../../../Watchlist/gql/common/hooks'
import { detectWatchlistType, PROJECT } from '../../../../Watchlist/detector'
import styles from '../index.module.scss'

const TopPanel = ({ watchlist, widgets, setWidgets, className }) => {
  const { isAuthor, isAuthorLoading } = useIsAuthor(watchlist)
  const { type } = detectWatchlistType(watchlist)

  if (!watchlist.id) {
    return null
  }

  const { name, description } = watchlist

  return (
    <section className={cx(styles.wrapper, className)}>
      <div className={styles.row}>
        <Title name={name} description={description} />
        <Actions
          isAuthor={isAuthor}
          isAuthorLoading={isAuthorLoading}
          watchlist={watchlist}
        />
      </div>
      <div className={styles.row}>
        {type === PROJECT && (
          <Widgets widgets={widgets} setWidgets={setWidgets} />
        )}
        <Share watchlist={watchlist} isAuthor={isAuthor} />
        {isAuthor && type === PROJECT && <WeeklyReport {...watchlist} />}
      </div>
    </section>
  )
}

export default TopPanel
