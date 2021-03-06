import React from 'react'
import Card from './Card'
import styles from './AddressCard.module.scss'

const AddressCard = props => {
  const { listItems } = props.watchlist
  const { length } = listItems

  return (
    <Card
      {...props}
      classes={styles}
      middleChildren={
        length ? (
          <>
            {length}
            <div className={styles.address}>address{length > 1 && 'es'}</div>
          </>
        ) : (
          <div className={styles.address}>No addresses</div>
        )
      }
    />
  )
}
AddressCard.defaultProps = {
  path: '/watchlist/addresses/'
}

export default AddressCard
