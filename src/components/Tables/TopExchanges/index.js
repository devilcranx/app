import React, { useState, useMemo } from 'react'
import cx from 'classnames'
import Loader from '@santiment-network/ui/Loader/Loader'
import { COLUMNS, DEFAULT_SORTING } from './columns'
import { useTopExchanges } from './gql'
import { StablecoinsSelector } from '../../../ducks/Stablecoins/StablecoinSelector/ProjectsSelectors'
import Table from '../../../ducks/Table'
import styles from './index.module.scss'

const DEFAULT_STABLECOIN = {
  slug: 'stablecoins',
  name: 'All stablecoins',
  ticker: ''
}

export const TopExchangesTableTitle = ({
  loading,
  title = 'Holdings on the top exchanges'
}) => {
  return (
    <div className={styles.title}>
      <h3 className={styles.text}>{title}</h3>
      {loading && <Loader className={styles.headerLoader} />}
    </div>
  )
}

const TopExchanges = ({ className, isStablecoinPage, ...props }) => {
  const [asset, setAsset] = useState(DEFAULT_STABLECOIN)
  const additionalProps =
    isStablecoinPage && asset.slug !== 'stablecoins'
      ? { slug: asset.slug, selector: null }
      : {}
  const [items, loading] = useTopExchanges({ ...props, ...additionalProps })

  const data = useMemo(() => items, [items])
  const columns = useMemo(() => COLUMNS, [])

  return (
    <>
      <TopExchangesTableTitle loading={loading} items={items} />
      {isStablecoinPage && (
        <div className={styles.header}>
          <StablecoinsSelector asset={asset} setAsset={setAsset} />
        </div>
      )}
      <Table
        data={data}
        columns={columns}
        options={{
          loadingSettings: {
            repeatLoading: 10,
            isLoading: loading && data.length === 0
          },
          sortingSettings: { defaultSorting: DEFAULT_SORTING, allowSort: true },
          stickySettings: {
            isStickyHeader: true,
            isStickyColumn: true,
            stickyColumnIdx: 0
          }
        }}
        className={cx(className, styles.tableWrapper)}
        classes={{
          table: styles.table,
          loader: styles.loadingWrapper,
          loaderRow: styles.loadingRow
        }}
      />
    </>
  )
}

export default TopExchanges
