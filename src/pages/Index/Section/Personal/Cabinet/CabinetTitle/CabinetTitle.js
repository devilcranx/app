import React from 'react'
import styles from './CabinetTitle.module.scss'

const CabinetTitle = ({ img, title, description }) => (
  <div className={styles.headerContainer}>
    <div className={styles.header}>
      {img}

      <div className={styles.header__content}>
        <div className={styles.header__content__title}>{title}</div>
        <div className={styles.header__content__description}>{description}</div>
      </div>
    </div>
  </div>
)

export default CabinetTitle
