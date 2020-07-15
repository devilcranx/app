import React, { useState, useCallback } from 'react'
import ReactTable from 'react-table'
import cx from 'classnames'
import Sticky from 'react-stickynode'
import { connect } from 'react-redux'
import 'react-table/react-table.css'
import {
  ASSETS_FETCH,
  ASSETS_SET_MIN_VOLUME_FILTER,
  WATCHLIST_TOGGLE_COLUMNS
} from '../../../../actions/types'
import Refresh from '../../../../components/Refresh/Refresh'
import ServerErrorMessage from './../../../../components/ServerErrorMessage'
import AssetsToggleColumns from './AssetsToggleColumns'
import Filter from '../Filter'
import { COLUMNS, COMMON_SETTINGS, COLUMNS_SETTINGS } from './asset-columns'
import '../../../../pages/Projects/ProjectsTable.scss'
import styles from './AssetsTable.module.scss'

export const CustomHeadComponent = ({ children, className, ...rest }) => (
  <Sticky enabled innerZ={1}>
    <div className={cx('rt-thead', className)} {...rest}>
      {children}
    </div>
  </Sticky>
)

const AssetsTable = ({
  Assets = {
    isLoading: true,
    error: undefined,
    type: 'all'
  },
  items,
  filterType,
  showAll = false,
  preload,
  classes = {},
  refetchAssets,
  minVolume = 0,
  listName,
  type,
  watchlist,
  projectsCount,
  settings,
  allColumns,
  isAuthor,
  setHiddenColumns,
  showCollumnsToggle = true,
  className,
  columnProps
}) => {
  const [hovered, setHovered] = useState()

  const { isLoading, error, timestamp, typeInfo } = Assets
  const key = typeInfo.listId || listName
  const { sorting, pageSize, hiddenColumns } = settings[key] || {}
  if (error && error.message !== 'Network error: Failed to fetch') {
    return <ServerErrorMessage />
  }

  const changeShowing = (columns, hiddenColumns) => {
    const modifiedColumns = JSON.parse(JSON.stringify(columns))
    hiddenColumns.forEach(name => (modifiedColumns[name].show = false))

    return modifiedColumns
  }

  const savedHidden = hiddenColumns || COMMON_SETTINGS.hiddenColumns
  const sortingColumn = sorting || COMMON_SETTINGS.sorting
  const columnsAmount = pageSize || COMMON_SETTINGS.pageSize

  const [hidden, changeHidden] = useState(savedHidden)
  const [columns, changeColumns] = useState(
    changeShowing(COLUMNS_SETTINGS, savedHidden)
  )

  if (savedHidden !== hidden) {
    changeHidden(savedHidden)
    changeColumns(changeShowing(COLUMNS_SETTINGS, savedHidden))
  }

  const toggleColumn = ({ name, show, selectable }) => {
    const toggledColumns = Object.assign({}, columns)
    // NOTE(haritonasty): such access to the fields is necessary for Safari bug (shuffle properties)
    toggledColumns[name] = {
      ...toggledColumns[name],
      show: selectable ? !show : show
    }

    if (selectable) {
      const columns = show
        ? [...savedHidden, name]
        : savedHidden.filter(item => item !== name)
      setHiddenColumns({
        listName,
        hiddenColumns: columns,
        listId: typeInfo.listId
      })
    }
    return changeColumns(toggledColumns)
  }

  const shownColumns = COLUMNS(preload, columnProps).filter(
    ({ id }) => columns[id].show && allColumns.includes(id)
  )

  const onMouseEnter = useCallback(
    ({ index }) => {
      setHovered(items[index])
    },
    [items]
  )

  const onMouseLeave = () => {
    setHovered()
  }

  return (
    <div onMouseLeave={onMouseLeave} className={classes.container}>
      <div className={styles.top} id='tableTop'>
        {filterType ? (
          <span>Showed based on {filterType} anomalies</span>
        ) : (
          <Refresh
            timestamp={timestamp}
            onRefreshClick={() => refetchAssets({ ...typeInfo, minVolume })}
          />
        )}
        <div className={styles.actions}>
          {showCollumnsToggle && (
            <AssetsToggleColumns columns={columns} onChange={toggleColumn} />
          )}
          {type === 'screener' && (
            <Filter
              watchlist={watchlist}
              // projectsCount={projectsCount}
              projectsCount={items.length}
              isAuthor={isAuthor}
            />
          )}
        </div>
      </div>
      <ReactTable
        loading={isLoading}
        showPagination={!showAll}
        showPaginationTop={false}
        showPaginationBottom
        defaultPageSize={columnsAmount}
        pageSizeOptions={[5, 10, 20, 25, 50, 100]}
        pageSize={showAll ? items && items.length : undefined}
        minRows={0}
        sortable={false}
        resizable={false}
        defaultSorted={[sortingColumn]}
        className={cx('-highlight', styles.assetsTable, className)}
        data={items}
        columns={shownColumns}
        loadingText='Loading...'
        TheadComponent={CustomHeadComponent}
        getTdProps={() => ({
          onClick: (e, handleOriginal) => {
            if (handleOriginal) handleOriginal()
          },
          style: { border: 'none' },
          hovered: hovered
        })}
        getTrGroupProps={(state, rowInfo) => {
          return {
            onMouseEnter: () => {
              onMouseEnter(rowInfo)
            }
          }
        }}
      />
    </div>
  )
}

const mapStateToProps = ({
  projects: {
    filters: { minVolume }
  },
  watchlistUi: { watchlistsSettings }
}) => ({ minVolume, settings: watchlistsSettings })

const mapDispatchToProps = (dispatch, { refetchAssets }) => ({
  refetchAssets:
    refetchAssets ||
    (({ type, listName, listId, minVolume = 0 }) =>
      dispatch({
        type: ASSETS_FETCH,
        payload: {
          type,
          list: { name: listName, id: listId },
          filters: { minVolume }
        }
      })),
  setMinVolumeFilter: () => dispatch({ type: ASSETS_SET_MIN_VOLUME_FILTER }),
  setHiddenColumns: payload =>
    dispatch({ type: WATCHLIST_TOGGLE_COLUMNS, payload })
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetsTable)