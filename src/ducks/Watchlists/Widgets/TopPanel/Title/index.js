import React from 'react'
import HelpPopup from '../../../../../components/HelpPopup/HelpPopup'
import styles from './index.module.scss'

const Title = ({ name, description }) => (
  <>
    <h1 className={styles.name}>{name}</h1>
    {description && (
      <HelpPopup triggerClassName={styles.description}>{description}</HelpPopup>
    )}
  </>
)

export default Title
