import React from 'react'
import cx from 'classnames'
import BaseBtn from './BaseBtn'
import styles from './FlatBtn.module.scss'

const FlatBtn = ({ children, className = '', isActive, ...props }) => {
  return (
    <BaseBtn
      className={cx({
        [`${styles.button} ${className}`]: true,
        [styles.active]: isActive
      })}
      {...props}
    >
      {children}
    </BaseBtn>
  )
}

export default FlatBtn
