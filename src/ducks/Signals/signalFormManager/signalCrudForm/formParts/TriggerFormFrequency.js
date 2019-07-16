import React from 'react'
import PropTypes from 'prop-types'
import FormikSelect from '../../../../../components/formik-santiment-ui/FormikSelect'
import FormikLabel from '../../../../../components/formik-santiment-ui/FormikLabel'
import {
  getFrequencyTimeType,
  getFrequencyTimeValues,
  getNearestFrequencyTimeValue,
  getNearestFrequencyTypeValue
} from '../../../utils/utils'
import {
  FREQUENCY_TYPES_OPTIONS,
  frequencyTymeValueBuilder
} from '../../../utils/constants'
import styles from '../signal/TriggerForm.module.scss'

const propTypes = {
  metaFormSettings: PropTypes.any.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  frequencyType: PropTypes.any,
  frequencyTimeType: PropTypes.any
}

export const TriggerFormFrequency = ({
  metaFormSettings,
  setFieldValue,
  metric,
  frequencyType,
  frequencyTimeType
}) => {
  const defaultFrequencyType = metaFormSettings.frequencyType

  const frequencyOptions = FREQUENCY_TYPES_OPTIONS.filter(item => {
    return !item.disabledMetrics || item.disabledMetrics.indexOf(metric) === -1
  })

  return (
    <div className={styles.row}>
      <div className={styles.Field}>
        <FormikLabel text='Frequency of notifications' />
        <FormikSelect
          name='frequencyType'
          isClearable={false}
          disabled={defaultFrequencyType.isDisabled}
          defaultValue={defaultFrequencyType.value.value}
          isSearchable
          placeholder='Choose a frequency'
          options={frequencyOptions}
          onChange={frequencyType => {
            const newFrequencyTimeType = getNearestFrequencyTypeValue(
              frequencyType
            )
            setFieldValue('frequencyTimeType', newFrequencyTimeType)
            setFieldValue(
              'frequencyTimeValue',
              getNearestFrequencyTimeValue(newFrequencyTimeType)
            )
          }}
        />
      </div>
      <div className={styles.Field}>
        <FormikLabel />
        <div className={styles.frequency}>
          <FormikSelect
            name='frequencyTimeValue'
            className={styles.frequencyTimeValue}
            isClearable={false}
            disabled={!frequencyType || !frequencyTimeType}
            isSearchable
            options={getFrequencyTimeValues(frequencyTimeType)}
          />
          <FormikSelect
            className={styles.frequencyTimeType}
            name='frequencyTimeType'
            disabled={!frequencyType}
            isClearable={false}
            onChange={frequencyTimeType => {
              setFieldValue('frequencyTimeValue', frequencyTymeValueBuilder(1))
            }}
            options={getFrequencyTimeType(frequencyType)}
          />
        </div>
      </div>
    </div>
  )
}

TriggerFormFrequency.propTypes = propTypes
