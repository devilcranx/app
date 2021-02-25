import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import Button from '@santiment-network/ui/Button'
import Message from '@santiment-network/ui/Message'
import PublicityToggle from '../ChangeVisibility'
import ShareModalTrigger from '../../../../components/Share/ShareModalTrigger'
import { useShortShareLink } from '../../../../components/Share/hooks'
import { detectWatchlistType } from '../../../Watchlist/detector'
import styles from './index.module.scss'

const Share = ({ watchlist, isAuthor }) => {
  const [isPublic, setIsPublic] = useState(watchlist.isPublic)
  const { shortShareLink, getShortShareLink } = useShortShareLink()
  const { label } = detectWatchlistType(watchlist)

  useEffect(
    () => {
      if (isPublic !== watchlist.isPublic) {
        setIsPublic(watchlist.isPublic)
      }
    },
    [watchlist.isPublic]
  )

  if (!isAuthor || !watchlist) {
    return null
  }

  return (
    <ShareModalTrigger
      dialogTitle={`Share ${label}`}
      shareLink={shortShareLink}
      isDisabled={!isPublic}
      trigger={props => (
        <Button
          {...props}
          className={styles.trigger}
          onMouseDown={getShortShareLink}
          icon='share'
        >
          Share
        </Button>
      )}
    >
      <div
        className={cx(
          styles.messageWrapper,
          isPublic && styles.messageWrapper__hide
        )}
      >
        <Message variant='warn' className={styles.message}>
          Your {label} is private. Please, switch it to “Public” first.
        </Message>
      </div>
      <PublicityToggle
        variant='flat'
        watchlist={watchlist}
        className={styles.toggle}
      />
    </ShareModalTrigger>
  )
}

Share.propTypes = {
  watchlist: PropTypes.object.isRequired,
  isAuthor: PropTypes.bool.isRequired
}

export default Share
