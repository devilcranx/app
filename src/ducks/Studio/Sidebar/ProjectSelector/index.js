import React, { useState } from 'react'
import Icon from '@santiment-network/ui/Icon'
import ProjectSelectDialog from '../../Compare/ProjectSelectDialog'
import { DEFAULT_TABS } from '../../Compare/ProjectSelectTabs'
import { FIAT_MARKET_ASSETS } from '../../../dataHub/fiat'
import ProjectIcon from '../../../../components/ProjectIcon/ProjectIcon'
import styles from './index.module.scss'

const CUSTOM_CATEGORY = {
  Fiat: () => Promise.resolve(FIAT_MARKET_ASSETS)
}

const CUSTOM_TABS = DEFAULT_TABS.concat(Object.keys(CUSTOM_CATEGORY))

const CategoryModifier = {
  All: assets => assets.concat(FIAT_MARKET_ASSETS)
}

const Selector = ({ slug, name, onClick }) => (
  <div className={styles.selector} onClick={onClick}>
    <ProjectIcon size={20} slug={slug} className={styles.icon} />
    {name}
    <Icon type='arrow-down' className={styles.arrow} />
  </div>
)

const ProjectSelector = ({ project: { slug, name }, onProjectSelect }) => {
  const [isOpened, setIsOpened] = useState()

  function closeDialog () {
    setIsOpened(false)
  }

  function openDialog () {
    setIsOpened(true)
  }

  function onSelect (project) {
    onProjectSelect(project)
    closeDialog()
  }

  return (
    <ProjectSelectDialog
      open={isOpened}
      activeSlug={slug}
      onOpen={openDialog}
      onClose={closeDialog}
      onSelect={onSelect}
      trigger={<Selector slug={slug} name={name} onClick={openDialog} />}
      customTabs={CUSTOM_TABS}
      CustomCategory={CUSTOM_CATEGORY}
      CategoryModifier={CategoryModifier}
    />
  )
}

export default ProjectSelector