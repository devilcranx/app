import React from 'react'
import cx from 'classnames'
import { Helmet } from 'react-helmet'
import CommonFooter from '../ProMetrics/ProMetricsFooter/CommonFooter'
import MobileHeader from '../../components/MobileHeader/MobileHeader'
import { DesktopOnly, MobileOnly } from '../../components/Responsive'
import { Block } from '../StablecoinsPage/StablecoinsPageStructure'
import ResearchesBlock from '../../components/ResearchesBlock'
import LeftPageNavigation from '../../components/LeftPageNavigation/LeftPageNavigation'
import UniswapHistoricalBalance from '../../ducks/Studio/Tabs/UniswapHistoricalBalance/UniswapHistoricalBalance'
import styles from './UniswapProtocolPage.module.scss'
import UniswapTopTransactions from '../../ducks/UniswapProtocol/UniswapTopTransactions/UniswapTopTransactions'

const ANCHORS = {
  Overview: {
    label: 'Uniswap Protocol',
    key: 'overview'
  },
  TopTransactions: {
    label: 'Top Token Transaction',
    key: 'top-transaction'
  }
}

const UniswapProtocolPage = ({ history, isDesktop }) => {
  return (
    <div className={cx('page', styles.container)}>
      <Helmet
        title={'Uniswap Protocol | Sanbase'}
        meta={[
          {
            property: 'og:title',
            content: ' Uniswap Protocol | Sanbase'
          },
          {
            property: 'og:description',
            content: 'Real-time information of Uniswap Protocol'
          }
        ]}
      />

      <MobileOnly>
        <MobileHeader
          showBack={true}
          goBack={history.goBack}
          classes={styles}
        />
      </MobileOnly>

      <div className={styles.header}>
        <div className={cx(styles.inner, styles.content)}>
          <div className={styles.pageDescription}>
            <h3 className={styles.title}>Uniswap Protocol Dashboard</h3>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <DesktopOnly>
          <LeftPageNavigation anchors={ANCHORS} />
        </DesktopOnly>

        <div className={styles.inner}>
          <Block
            title='Historical Balance'
            className={styles.firstBlock}
            tag={ANCHORS.Overview.key}
          >
            <UniswapHistoricalBalance />
          </Block>

          <Block
            title='Top Token Transactions, 30d'
            tag={ANCHORS.TopTransactions.key}
          >
            <UniswapTopTransactions />
          </Block>
        </div>
      </div>

      <ResearchesBlock className={styles.researchers} />

      <CommonFooter />
    </div>
  )
}

export default UniswapProtocolPage
