import React from 'react'
import styles from './CompareInfo.module.scss'

const CompareInfo = ({ selected, cleanAll }) => {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.text}>
          {selected.length} asset{selected.length !== 1 ? 's are ' : ' is '}
          selected.
        </div>

        {selected.length > 0 && cleanAll && (
          <div className={styles.clean} onClick={cleanAll}>
            Clear all
          </div>
        )}
      </div>
    </div>
  )
}

export default CompareInfo
