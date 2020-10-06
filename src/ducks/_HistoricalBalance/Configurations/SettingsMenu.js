import React, { useMemo } from 'react'
import { generateUrl } from '../url'
import {
  Menu,
  Setting,
  ShareButton,
} from '../../SANCharts/ChartSettingsContextMenu'
import styles from './index.module.scss'

const SettingsMenu = ({
  settings,
  chartAssets,
  priceAssets,
  togglePriceAsset,
}) => {
  const { address } = settings
  const shareLink = useMemo(() => generateUrl(address, chartAssets, []), [
    address,
    chartAssets,
  ])

  return (
    <Menu>
      <ShareButton shareLink={shareLink}></ShareButton>
      <hr className={styles.divider} />
      <Setting title='Log scale'></Setting>
      {chartAssets.length > 0 && <hr className={styles.divider} />}
      {chartAssets.map(({ slug }) => (
        <Setting
          key={slug}
          title={`Price of ${slug}`}
          onClick={() => togglePriceAsset(slug)}
          isActive={priceAssets.includes(slug)}
        ></Setting>
      ))}
    </Menu>
  )
}

export default SettingsMenu
