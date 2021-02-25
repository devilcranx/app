import React from 'react'
import PropTypes from 'prop-types'
import { NonAuthorTrigger } from './Items'
import SaveAs from '../../../Actions/SaveAs'
import { useUserScreeners } from '../../../gql/hooks'
import { detectWatchlistType } from '../../../../Watchlist/detector'
import ProPopupWrapper from '../../../../../components/ProPopup/Wrapper'
import styles from './index.module.scss'

const Actions = ({ watchlist, onClick, isAuthor, isAuthorLoading }) => {
  const { type, label } = detectWatchlistType(watchlist)
  const [screeners = []] = useUserScreeners()

  const { id } = watchlist
  if (!id || isAuthorLoading) {
    return null
  }

  if (!isAuthor) {
    return (
      <div onClick={onClick} className={styles.container}>
        <ProPopupWrapper type={label} trigger={NonAuthorTrigger}>
          <SaveAs
            type={type}
            title={label}
            watchlist={watchlist}
            lists={screeners}
            trigger={<NonAuthorTrigger />}
          />
        </ProPopupWrapper>
      </div>
    )
  }

  return <div onClick={onClick} className={styles.container} />
}

Actions.propTypes = {
  watchlist: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    isPublic: PropTypes.bool,
    function: PropTypes.object,
    type: PropTypes.string
  }),
  isAuthor: PropTypes.bool.isRequired,
  isAuthorLoading: PropTypes.bool.isRequired,
  onClick: PropTypes.func
}

Actions.defaultProps = {
  watchlist: {},
  onClick: _ => _
}

export default Actions
