import React from 'react'
import { formatNumber } from '../../../../../utils/formatting'
import styles from './../signal/TriggerForm.module.scss'

export const LastPriceComponent = ({ lastPrice }) => {
  if (lastPrice === undefined) return ''

  return (
    <div className={styles.lastPrice}>
      Current price is {formatNumber(lastPrice, { currency: 'USD' })}
    </div>
  )
}