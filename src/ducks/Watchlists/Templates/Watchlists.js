import React from 'react'
import cx from 'classnames'
import Checkboxes from '@santiment-network/ui/Checkboxes'
import { hasAssetById } from '../utils'
import { VisibilityIndicator } from '../../../components/VisibilityIndicator'
import NewWatchlist from '../Actions/New'
import NewBtn from '../Actions/New/NewBtn'
import styles from './Watchlists.module.scss'

const Watchlists = ({
  lists = [],
  projectId,
  slug,
  onWatchlistClick,
  classes = {}
}) => (
  <>
    <div className={styles.listWrapper}>
      <div className={cx(styles.list, classes.list)}>
        {lists.length > 0 ? (
          lists.map(({ id, name, isPublic, listItems = [] }) => (
            <div className={styles.watchlist} key={id}>
              <Checkboxes
                className={styles.checkbox}
                options={[name]}
                defaultSelectedIndexes={
                  hasAssetById({ listItems, id: projectId }) ? [name] : []
                }
                key={id}
                labelOnRight
                labelClassName={styles.label}
                onSelect={() =>
                  onWatchlistClick({
                    id,
                    slug,
                    listItems
                  })
                }
              />
              <VisibilityIndicator isPublic={isPublic} />
            </div>
          ))
        ) : (
          <div>You don't have any watchlists yet.</div>
        )}
      </div>
    </div>
    <NewWatchlist
      type='watchlist'
      trigger={<NewBtn border className={styles.watchlistNew} />}
      lists={lists}
    />
  </>
)

export default Watchlists
