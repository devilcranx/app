import React, { useState, useEffect, useMemo } from 'react'
import Panel from '@santiment-network/ui/Panel'
import Search from '@santiment-network/ui/Search'
import Message from '@santiment-network/ui/Message'
import ContextMenu from '@santiment-network/ui/ContextMenu'
import { InputWithIcon as Input } from '@santiment-network/ui/Input'
import { useFeaturedWatchlists, useUserWatchlists } from '../../../gql/hooks'
import { useMessage } from './hooks'
import Item from './Item'
import {
  makeHumanReadableState,
  ALL_ASSETS_TEXT,
  MAX_VISIBLE_SYMBOLS
} from './utils'
import { ALL_PROJECTS_WATCHLIST_SLUG } from '../../../utils'
import styles from './index.module.scss'

const EntryPoint = ({ baseProjects = [], setBaseProjects }) => {
  const [state, setState] = useState(
    baseProjects.length > 0 ? baseProjects : ALL_ASSETS_TEXT
  )
  const [categories] = useFeaturedWatchlists()
  const [watchlists = []] = useUserWatchlists()
  const [currentSearch, setCurrentSearch] = useState('')
  const { message, updateMessage } = useMessage(state)

  useEffect(
    () => {
      if (Array.isArray(state) && state.length === 0) {
        setState('')
      } else {
        updateMessage(state)
      }
    },
    [state]
  )

  const filteredCategories = useMemo(
    () =>
      categories.filter(({ id, slug }) => {
        const isAllAssetsList = slug === ALL_PROJECTS_WATCHLIST_SLUG
        const isInState = Array.isArray(state) && state.includes(id)

        return !isAllAssetsList && !isInState
      }),
    [state, categories]
  )

  const filteredWatchlists = useMemo(
    () =>
      watchlists.filter(({ id }) => {
        const isInState = Array.isArray(state) && state.includes(id)
        return !isInState
      }),
    [state, watchlists]
  )

  const shortInputState = useMemo(
    () => {
      const text = makeHumanReadableState(state)
      return text.length > MAX_VISIBLE_SYMBOLS
        ? text.slice(0, MAX_VISIBLE_SYMBOLS) + '...'
        : text
    },
    [state]
  )

  function addItemInState (name) {
    setState(state === ALL_ASSETS_TEXT ? [name] : [...state, name])
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.overview}>
        <span className={styles.title}>Entry point: </span>
        <span className={styles.explanation}>
          {makeHumanReadableState(state)}
        </span>
      </div>
      <ContextMenu
        passOpenStateAs='data-isactive'
        position='bottom'
        align='start'
        className={styles.dropdown}
        trigger={
          <Input
            readOnly
            className={styles.trigger__btn}
            iconClassName={styles.trigger__arrow}
            icon='arrow-down'
            iconPosition='right'
            value={shortInputState}
          />
        }
      >
        <Panel className={styles.panel}>
          <Search
            autoFocus
            onChange={value => setCurrentSearch(value)}
            placeholder='Type to search'
            className={styles.search}
          />
          <div className={styles.content}>
            <div className={styles.scroller}>
              {state && (
                <div className={styles.selected}>
                  {state === ALL_ASSETS_TEXT ? (
                    <Item
                      onClick={() => setState('')}
                      isActive={true}
                      name={ALL_ASSETS_TEXT}
                    />
                  ) : (
                    state.map(name => (
                      <Item
                        key={name}
                        onClick={() =>
                          setState(state.filter(item => item !== name))
                        }
                        isActive={true}
                        name={name}
                      />
                    ))
                  )}
                </div>
              )}
              {message && (
                <Message
                  variant='warn'
                  icon='info-round'
                  fill={false}
                  className={styles.message}
                >
                  {message}
                </Message>
              )}
              {filteredCategories.length > 0 && (
                <div className={styles.list}>
                  <h3 className={styles.heading}>Categories</h3>
                  {filteredCategories.map(({ name, id, slug }) => (
                    <Item
                      key={id}
                      onClick={() => addItemInState(id)}
                      name={name}
                      id={id}
                      slug={slug}
                    />
                  ))}
                </div>
              )}
              {filteredWatchlists.length > 0 && (
                <div className={styles.list}>
                  <h3 className={styles.heading}>My watchlists</h3>
                  {filteredWatchlists.map(({ name, id, slug }) => (
                    <Item
                      key={id}
                      onClick={() => addItemInState(id)}
                      name={name}
                      id={id}
                      slug={slug}
                    />
                  ))}
                </div>
              )}
              <div className={styles.list}>
                <h3 className={styles.heading}>Assets</h3>
                {state !== ALL_ASSETS_TEXT && (
                  <Item
                    onClick={() => setState(ALL_ASSETS_TEXT)}
                    isActive={false}
                    name={ALL_ASSETS_TEXT}
                  />
                )}
              </div>
            </div>
          </div>
        </Panel>
      </ContextMenu>
    </div>
  )
}

export default EntryPoint
