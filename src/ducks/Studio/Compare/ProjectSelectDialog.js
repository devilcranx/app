import React, { useState, useEffect } from 'react'
import Dialog from '@santiment-network/ui/Dialog'
import Search from '@santiment-network/ui/Search'
import Projects from './Projects'
import styles from './ProjectSelectDialog.module.scss'

const ProjectSelectDialog = ({
  projects,
  open,
  onSelect,
  onClose,
  ...rest
}) => {
  const [searchedProjects, setSearchedProjects] = useState(projects)

  useEffect(
    () => {
      if (!open) {
        setSearchedProjects(projects)
      }
    },
    [open]
  )

  function searchProjects (searchTerm) {
    const lowerCase = searchTerm.toLowerCase()

    setSearchedProjects(
      projects.filter(
        ({ ticker, name }) =>
          name.toLowerCase().includes(lowerCase) ||
          ticker.toLowerCase().includes(lowerCase)
      )
    )
  }

  function onDialogClose () {
    setSearchedProjects(projects)
    if (onClose) {
      onClose()
    }
  }

  return (
    <Dialog
      title='Select project'
      onClose={onDialogClose}
      open={open}
      {...rest}
    >
      <div className={styles.wrapper}>
        <Search className={styles.search} onChange={searchProjects} autoFocus />
        <Projects
          projects={searchedProjects}
          onSelect={onSelect}
          className={styles.projects}
        />
      </div>
    </Dialog>
  )
}

ProjectSelectDialog.defaultProps = {
  projects: []
}

export default ProjectSelectDialog