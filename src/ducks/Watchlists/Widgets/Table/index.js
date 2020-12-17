import React, { useMemo } from 'react'
import { COLUMNS, DEFAULT_SORTING } from './new-columns'
import TableTop from './TableTop'
import Table from '../../../Table'
import { useVisibleItems, useColumns } from './hooks'
import { usePriceGraph } from './PriceGraph/hooks'
import { ASSETS_TABLE_COLUMNS } from './columns'
import { normalizeGraphData as normalizeData } from './PriceGraph/utils'
import { useComparingAssets } from '../../../../ducks/Watchlists/Widgets/Table/CompareDialog/hooks'
import styles from './index.module.scss'

const AssetsTable = ({
  items,
  loading,
  type,
  listName,
  watchlist,
  refetchAssets,
  timestamp
}) => {
  const { visibleItems, changeVisibleItems } = useVisibleItems()
  const { comparingAssets = [], updateAssets } = useComparingAssets()
  const { columns, toggleColumn, pageSize } = useColumns('Screener')
  const [graphData] = usePriceGraph({ slugs: visibleItems })

  const shownColumns = useMemo(
    () => {
      return COLUMNS.filter(
        ({ id }) => columns[id].show && ASSETS_TABLE_COLUMNS.includes(id)
      )
    },
    [columns]
  )
  const data = useMemo(() => normalizeData(graphData, items), [
    graphData,
    items
  ])

  return (
    <>
      <TableTop
        refetchAssets={refetchAssets}
        timestamp={timestamp}
        comparingAssets={comparingAssets}
        type={type}
        listName={listName}
        items={items}
        watchlist={watchlist}
        isLoading={loading}
        columns={columns}
        toggleColumn={toggleColumn}
      />
      <Table
        data={data}
        columns={shownColumns}
        options={{
          noDataSettings: {
            title: 'No matches!',
            description:
              "The assets for the filter which you applying weren't found. Check if it's correct or try another filter settings."
          },
          loadingSettings: {
            repeatLoading: 30,
            isLoading: loading && items.length === 0
          },
          sortingSettings: {
            defaultSorting: DEFAULT_SORTING,
            allowSort: true
          },
          stickySettings: {
            isStickyHeader: true,
            isStickyColumn: true,
            stickyColumnIdx: 2
          },
          paginationSettings: {
            pageSize,
            pageIndex: 0,
            pageSizeOptions: [10, 20, 50, 100],
            onChangeVisibleItems: changeVisibleItems
          },
          rowSelectSettings: {
            onChangeSelectedRows: updateAssets
          }
        }}
        className={styles.tableWrapper}
        classes={{
          table: styles.table,
          bodyRow: styles.tableRow,
          pagination: styles.pagination,
          headerColumn: styles.headerColumn,
          bodyColumn: styles.bodyColumn
        }}
      />
    </>
  )
}

export default AssetsTable