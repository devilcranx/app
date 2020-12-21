import React from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import SaveAs from '../Watchlists/Actions/SaveAs'
import ExplanationTooltip from '../../components/ExplanationTooltip/ExplanationTooltip'
import styles from './index.module.scss'

export const SaveAsButton = () => (
  <div className={cx(styles.action)}>
    <ExplanationTooltip text='Save as watchlist' offsetY={10}>
      <Icon type='add-watchlist' className={styles.action__icon} />
    </ExplanationTooltip>
  </div>
)

const SaveAsPopupTrigger = ({ type, watchlist, userWatchlists }) => {
  return (
    <SaveAs
      watchlist={watchlist}
      lists={userWatchlists}
      type={type}
      // createWatchlist={createWatchlist}
      createWatchlist={console.log}
      trigger={<SaveAsButton />}
    />
  )
}

SaveAsPopupTrigger.defaultProps = {
  type: 'watchlist',
  userWatchlists: {}
}

export default SaveAsPopupTrigger
