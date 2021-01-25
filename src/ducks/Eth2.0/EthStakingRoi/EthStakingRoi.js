import React, { useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Skeleton from '../../../components/Skeleton/Skeleton'
import styles from './EthStakingRoi.module.scss'

const ETH2_STAKING_ROI_QUERY = gql`
  query getMetric($from: DateTime!) {
    getMetric(metric: "labelled_exchange_balance_sum") {
      tableData(
        selector: { slug: "ethereum", label: "eth2stakingcontract" }
        from: $from
        to: "utc_now"
      ) {
        values
      }
    }
  }
`

const FROM = new Date('2020-11-03 00:00:00')

export const useEthROI = () => {
  const { data, loading, error } = useQuery(ETH2_STAKING_ROI_QUERY, {
    variables: {
      from: FROM
    }
  })

  return useMemo(
    () => {
      return {
        data: data ? data.getMetric.tableData.values : [],
        loading,
        error
      }
    },
    [data, loading, error]
  )
}

const toRoi = value =>
  value > 524288 ? (Math.sqrt(value) * 181) / value : 0.25

const EthStakingRoi = () => {
  const { data, loading } = useEthROI()

  const value = useMemo(
    () => {
      const transformed = data

      return toRoi(transformed[transformed.length - 1])
    },
    [data]
  )

  return (
    <div>
      <Skeleton repeat={1} className={styles.skeleton} show={loading} />
      {value}
    </div>
  )
}

export default EthStakingRoi
