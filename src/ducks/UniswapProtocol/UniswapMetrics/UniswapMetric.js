import React, { useEffect, useMemo, useState } from 'react'
import { useTimeseries } from '../../Studio/timeseries/hooks'
import { formIntervalSettings } from '../../SANCharts/IntervalSelector'
import { formatNumber } from '../../../utils/formatting'
import Skeleton from '../../../components/Skeleton/Skeleton'
import styles from './UniswapMetric.module.scss'

const INTERVAL = '1d'

const UniswapMetric = ({ metric }) => {
  const { human_readable_name, key } = metric
  const [settings, setSettings] = useState({
    slug: 'uniswap',
    ...formIntervalSettings(INTERVAL)
  })
  const metrics = useMemo(
    () => {
      return [metric]
    },
    [metric]
  )

  const [data, loadings] = useTimeseries(metrics, settings)

  const sum = useMemo(
    () => {
      return data.reduce((acc, item) => {
        return acc + item[key]
      }, 0)
    },
    [data, key]
  )

  const isLoading = loadings.length > 0

  useEffect(() => {
    const interval = setInterval(() => {
      !isLoading &&
        setSettings({
          ...settings,
          ...formIntervalSettings(INTERVAL)
        })
    }, 15000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className={styles.card}>
      <div className={styles.title}>{human_readable_name}</div>

      <div className={styles.value}>{formatNumber(sum)}</div>
    </div>
  )
}

export default UniswapMetric
