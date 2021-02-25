import React from 'react'
import cx from 'classnames'
import Actions from '../Actions'
import Share from '../../../Actions/Share'
import Widgets from '../Widgets'
import WeeklyReport from '../../../Actions/WeeklyReport'
import HelpPopup from '../../../../../components/HelpPopup/HelpPopup'
import { useIsAuthor } from '../../../../Watchlist/gql/common/hooks'
import styles from '../index.module.scss'

const TopPanel = ({
  name,
  description,
  id,
  watchlist,
  className,
  isMonitored,
  assets,
  ...props
}) => {
  const { isAuthor, isAuthorLoading } = useIsAuthor(watchlist)
  return (
    <section className={cx(styles.wrapper, className)}>
      <div className={styles.row}>
        <h1 className={styles.name}>{name}</h1>
        {description && (
          <HelpPopup triggerClassName={styles.description}>
            {description}
          </HelpPopup>
        )}
        <Actions
          isAuthor={isAuthor}
          isAuthorLoading={isAuthorLoading}
          watchlist={watchlist}
        />
      </div>
      <div className={styles.row}>
        <Widgets {...props} />
        <Share watchlist={watchlist} isAuthor={isAuthor} />
        {isAuthor && (
          <WeeklyReport id={id} name={name} isMonitored={isMonitored} />
        )}
      </div>
    </section>
  )
}

export default TopPanel
