import React from 'react'
import { Link } from 'react-router-dom'
import { Panel, Icon } from '@santiment-network/ui'
import moment from 'moment'
import MultilineText from '../MultilineText/MultilineText'
import styles from './InsightDraftCard.module.scss'

const getInsightContent = htmlContent => {
  let tempHTMLElement = document.createElement('div')
  tempHTMLElement.innerHTML = htmlContent
  const content = tempHTMLElement.textContent
  tempHTMLElement = null
  return content
}

const InsightDraftCard = ({ id, title, text, updatedAt }) => {
  return (
    <Panel>
      <Link to={`/insights-sonar/${id}`} className={styles.title}>
        {title}
      </Link>
      <p className={styles.text}>
        <MultilineText
          maxLines={2}
          id='insightCardText'
          text={getInsightContent(text)}
        />
      </p>
      <h4 className={styles.date}>Edited {moment(updatedAt).fromNow()}</h4>
      <Icon type='remove' className={styles.remove} />
    </Panel>
  )
}

export default InsightDraftCard
