import React from 'react'
import Tooltip from '@santiment-network/ui/Tooltip'
import Button from '@santiment-network/ui/Button'
import { Event } from '../dataHub/events'
import styles from './MetricExplanation.module.scss'

Event.trendPositionHistory.note = <Note>It will disable Anomalies</Note>

const Note = ({ children }) => (
  <p className={styles.note}>
    <span className={styles.warning}>Important!</span>
    <span className={styles.text}>{children}</span>
  </p>
)

const COMPLEXITY_NOTE =
  'The requested period is outside of your plan boundaries'

const MetricExplanation = ({
  children,
  label,
  fullTitle = label,
  description,
  video,
  note,
  withChildren = false,
  isComplexityError,
  ...rest
}) => {
  if (!description && isComplexityError) {
    return (
      <Tooltip className={styles.explanation} trigger={children} {...rest}>
        <div className={styles.explanation__content}>
          <Note>{COMPLEXITY_NOTE}</Note>
        </div>
      </Tooltip>
    )
  }

  return description ? (
    <Tooltip className={styles.explanation} trigger={children} {...rest}>
      <div className={styles.explanation__content}>
        <h4 className={styles.title}>{fullTitle}</h4>
        <p className={styles.text}>{description}</p>
        {note && note}
        {video && (
          <Button
            border
            as='a'
            href={video}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.button}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='14'
              fill='none'
            >
              <rect
                width='14.5'
                height='12.5'
                x='.75'
                y='.75'
                stroke='#9FAAC4'
                strokeWidth='1.5'
                rx='2.25'
              />
              <path
                fill='#9FAAC4'
                d='M10.87 6.74c.2.12.2.4 0 .52L6.75 9.73a.3.3 0 0 1-.45-.26V4.53a.3.3 0 0 1 .45-.26l4.12 2.47z'
              />
            </svg>
            <span className={styles.button__text}>Watch how to use it</span>
          </Button>
        )}
        {isComplexityError && <Note>{COMPLEXITY_NOTE}</Note>}
      </div>
    </Tooltip>
  ) : withChildren ? (
    children
  ) : null
}

export default MetricExplanation
