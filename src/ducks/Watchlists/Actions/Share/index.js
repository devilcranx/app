import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import Button from '@santiment-network/ui/Button'
import Message from '@santiment-network/ui/Message'
import PublicityToggle from '../ChangeVisibility'
import { isDynamicWatchlist } from '../../utils'
import ShareModalTrigger from '../../../../components/Share/ShareModalTrigger'
import { useShortShareLink } from '../../../../components/Share/hooks'
import styles from './index.module.scss'

const CustomContent = ({ isPublic, watchlist, type }) => (
  <>
    <div
      className={cx(
        styles.messageWrapper,
        isPublic && styles.messageWrapper__hide
      )}
    >
      <Message variant='warn' className={styles.message}>
        Your {type} is private. Please, switch it to “Public” first.
      </Message>
    </div>
    <PublicityToggle
      variant='flat'
      watchlist={watchlist}
      className={styles.toggle}
    />
  </>
)

const Share = ({ watchlist, isAuthor, className, customLink }) => {
  const [isPublic, setIsPublic] = useState(watchlist.isPublic)
  const { shortShareLink, getShortShareLink } = useShortShareLink()

  const type = isDynamicWatchlist(watchlist) ? 'screener' : 'watchlist'

  useEffect(
    () => {
      if (isPublic !== watchlist.isPublic) {
        setIsPublic(watchlist.isPublic)
      }
    },
    [watchlist.isPublic]
  )

  return isAuthor ? (
    <ShareModalTrigger
      dialogTitle={`Share ${type}`}
      shareLink={customLink || shortShareLink}
      isDisabled={!isPublic}
      trigger={props => (
        <Button
          {...props}
          className={cx(styles.trigger, className)}
          onMouseDown={customLink ? undefined : getShortShareLink}
          icon='share'
        >
          Share
        </Button>
      )}
    >
      <CustomContent watchlist={watchlist} isPublic={isPublic} type={type} />
    </ShareModalTrigger>
  ) : null
}

export default Share
