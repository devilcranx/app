import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Selector from '@santiment-network/ui/Selector/Selector'
import {
  METRIC_TARGET_OPTIONS,
  METRICS_WITH_TEXT_SELECTOR,
  METRIC_TARGET_TEXT
} from '../../../utils/constants'
import GetProjects from '../../../common/projects/getProjects'
import { isAsset, isWatchlist } from '../../../utils/utils'
import TriggerFormWatchlists from './TriggerFormWatchlists'
import { TriggerProjectsSelector } from './projectsSelector/TriggerProjectsSelector'
import styles from '../signal/TriggerForm.module.scss'

const propTypes = {
  metaFormSettings: PropTypes.any
}

const TriggerFormAssetWallet = ({
  metaFormSettings: { target: defaultAsset, signalType: defaultSignalType },
  setFieldValue,
  values,
  metric
}) => {
  const { signalType, target } = values
  const isAssets = isAsset(signalType)

  const defaultSelected = signalType
    ? signalType.value
    : defaultSignalType.value.value

  const options = METRICS_WITH_TEXT_SELECTOR.includes(metric)
    ? METRIC_TARGET_OPTIONS
    : METRIC_TARGET_OPTIONS.filter(option => option !== METRIC_TARGET_TEXT)

  return (
    <>
      <div className={cx(styles.row, styles.rowTop)}>
        <Selector
          className={styles.selector}
          options={options.map(({ value }) => value)}
          nameOptions={options.map(({ label }) => label)}
          defaultSelected={defaultSelected}
          onSelectOption={selectedValue => {
            const type = options.find(({ value }) => value === selectedValue)

            setFieldValue('signalType', type)
            if (isAsset(type)) {
              setFieldValue('target', target || defaultAsset.value)
            }
          }}
          variant='border'
        />
      </div>
      <div className={cx(styles.row, styles.rowTop)}>
        <div className={cx(styles.Field, styles.fieldFilled)}>
          {isAssets && (
            <GetProjects
              render={({ allProjects }) => {
                return (
                  <TriggerProjectsSelector
                    name='target'
                    target={target}
                    projects={allProjects}
                    setFieldValue={setFieldValue}
                  />
                )
              }}
            />
          )}
          {isWatchlist(signalType) && (
            <TriggerFormWatchlists
              values={values}
              setFieldValue={setFieldValue}
            />
          )}
        </div>
      </div>
    </>
  )
}

TriggerFormAssetWallet.propTypes = propTypes

export default TriggerFormAssetWallet
